import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import SeoHelmet from '../components/SeoHelmet';

export default function Admin() {
  const { data, addPost, updatePost, deletePost } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Tabs State: 'write', 'manage', or 'analytics'
  const [activeTab, setActiveTab] = useState('write');
  
  // Looker Studio State
  const [lookerUrl, setLookerUrl] = useState(localStorage.getItem('looker_studio_url') || '');
  const [tempLookerUrl, setTempLookerUrl] = useState('');

  const saveLookerUrl = () => {
    localStorage.setItem('looker_studio_url', tempLookerUrl);
    setLookerUrl(tempLookerUrl);
  };

  const resetLookerUrl = () => {
    localStorage.removeItem('looker_studio_url');
    setLookerUrl('');
    setTempLookerUrl('');
  };
  
  // Edit State
  const [editingPostId, setEditingPostId] = useState(null);

  // Form State
  const [postData, setPostData] = useState({
    title: '', categoryId: 'clean', subcategory: '', summary: '', thumbnailUrl: '',
    problem: '', cause: '', solution: '', tips: '', conclusion: '',
    recommendationName: '', recommendationUrl: '', recommendationPrice: '',
    faqs: [
      { q: '', a: '' },
      { q: '', a: '' },
      { q: '', a: '' }
    ]
  });

  const handleFaqChange = (index, field, value) => {
    const newFaqs = [...postData.faqs];
    newFaqs[index][field] = value;
    setPostData({ ...postData, faqs: newFaqs });
  };

  // Automatically update subcategory when category changes
  const handleCategoryChange = (e) => {
    const newCatId = e.target.value;
    const relatedCat = data.categories.find(c => c.id === newCatId);
    setPostData({
      ...postData,
      categoryId: newCatId,
      subcategory: relatedCat && relatedCat.subcategories && relatedCat.subcategories.length > 0 ? relatedCat.subcategories[0] : ''
    });
  };

  // Drafts State
  const [drafts, setDrafts] = useState([]);
  const [currentDraftId, setCurrentDraftId] = useState(null);
  
  const fetchDrafts = () => {
    fetch('/drafts.json')
      .then(res => res.json())
      .then(fetchedData => {
        if (Array.isArray(fetchedData)) {
          const published = JSON.parse(localStorage.getItem('published_drafts') || '[]');
          setDrafts(fetchedData.filter(d => !published.includes(d.id)));
        } else {
          setDrafts([]);
        }
      })
      .catch(err => console.error("크롤링된 초안 없음", err));
  };

  React.useEffect(() => {
    if (isAuthenticated) {
      fetchDrafts();
    }
  }, [isAuthenticated]);

  const loadDraft = (draft) => {
    setEditingPostId(null);
    setCurrentDraftId(draft.id);
    setPostData({
      title: draft.title || '',
      categoryId: draft.categoryId || 'clean',
      subcategory: draft.subcategory || '',
      summary: draft.summary || '',
      thumbnailUrl: draft.thumbnailUrl || '',
      problem: draft.content?.problem || '',
      cause: draft.content?.cause || '',
      solution: Array.isArray(draft.content?.solution) ? draft.content.solution.join('\n') : (draft.content?.solution || ''),
      tips: draft.content?.tips || '',
      conclusion: draft.content?.conclusion || '',
      recommendationName: draft.content?.recommendation?.name || '',
      recommendationUrl: draft.content?.recommendation?.url || '',
      recommendationPrice: draft.content?.recommendation?.price || '',
      faqs: Array.isArray(draft.content?.faqs) ? draft.content.faqs : [{q:'',a:''},{q:'',a:''},{q:'',a:''}]
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const removeDraft = (draftId) => {
    if(window.confirm("이 항목을 임시보관함에서 삭제하시겠습니까?")) {
      const published = JSON.parse(localStorage.getItem('published_drafts') || '[]');
      published.push(draftId);
      localStorage.setItem('published_drafts', JSON.stringify(published));
      setDrafts(prev => prev.filter(d => d.id !== draftId));
      if (currentDraftId === draftId) setCurrentDraftId(null);
    }
  };

  const loadPublishedPostForEdit = (post) => {
    setActiveTab('write');
    setEditingPostId(post.id);
    setCurrentDraftId(null);
    
    setPostData({
      title: post.title || '',
      categoryId: post.categoryId || 'clean',
      subcategory: post.subcategory || '',
      summary: post.summary || '',
      thumbnailUrl: post.thumbnailUrl || '',
      problem: post.content?.problem || '',
      cause: post.content?.cause || '',
      solution: Array.isArray(post.content?.solution) ? post.content.solution.join('\n') : (post.content?.solution || ''),
      tips: post.content?.tips || '',
      conclusion: post.content?.conclusion || '',
      recommendationName: post.content?.recommendation?.name || '',
      recommendationUrl: post.content?.recommendation?.url || '',
      recommendationPrice: post.content?.recommendation?.price || '',
      faqs: Array.isArray(post.content?.faqs) ? post.content.faqs : [{q:'',a:''},{q:'',a:''},{q:'',a:''}]
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDeletePublishedPost = (postId) => {
    if(window.confirm("⚠️ 정말로 이 발행된 게시물을 영구 삭제하시겠습니까? 복구할 수 없습니다.")) {
      deletePost(postId);
      alert('삭제되었습니다.');
    }
  };

  const clearForm = () => {
    setCurrentDraftId(null);
    setEditingPostId(null);
    setPostData({
      recommendationName: '', recommendationUrl: '', recommendationPrice: '',
      faqs: [{q:'',a:''},{q:'',a:''},{q:'',a:''}]
    });
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === '0000') setIsAuthenticated(true);
    else alert('비밀번호가 일치하지 않습니다.');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const preparedContent = {
      problem: postData.problem,
      cause: postData.cause,
      solution: postData.solution.split('\n').filter(Boolean),
      tips: postData.tips,
      conclusion: postData.conclusion,
      recommendation: {
        name: postData.recommendationName,
        url: postData.recommendationUrl,
        price: postData.recommendationPrice
      },
      faqs: postData.faqs.filter(f => f.q && f.a)
    };

    if (editingPostId) {
      updatePost(editingPostId, {
        title: postData.title,
        categoryId: postData.categoryId,
        subcategory: postData.subcategory,
        summary: postData.summary,
        thumbnailUrl: postData.thumbnailUrl,
        content: preparedContent
      });
      alert('포스팅이 성공적으로 수정되었습니다!');
    } else {
      const newPost = {
        id: `post-${Date.now()}`,
        slug: postData.title.toLowerCase().replace(/[^a-z0-9가-힣]/g, '-'),
        title: postData.title,
        categoryId: postData.categoryId,
        subcategory: postData.subcategory,
        summary: postData.summary,
        date: new Date().toISOString().split('T')[0],
        thumbnailUrl: postData.thumbnailUrl,
        content: preparedContent,
        monetization: {
          adsense: true,
          affiliate_links: [],
          affiliate_note: "이 포스팅은 제휴 마케팅이 포함되어 있으며, 이에 따른 일정액의 수수료를 제공받습니다."
        }
      };
      addPost(newPost);
      alert('구조화된 블로그 포스트가 새로 등록되었습니다!');

      if (currentDraftId) {
        const published = JSON.parse(localStorage.getItem('published_drafts') || '[]');
        published.push(currentDraftId);
        localStorage.setItem('published_drafts', JSON.stringify(published));
        setDrafts(prev => prev.filter(d => d.id !== currentDraftId));
      }
    }

    clearForm();
  };

  const [isDeploying, setIsDeploying] = useState(false);

  const handleDeploy = async () => {
    if (window.location.hostname !== 'localhost' && window.location.hostname !== '127.0.0.1') {
      alert('⚠️ 인터넷에 접속된 화면에서는 배포할 수 없습니다!\n반드시 컴퓨터의 로컬 환경(localhost:5173)에서 실행하세요.');
      return;
    }
    
    if (!window.confirm("현재까지 작성 및 수정한 모든 내용을 실제 웹사이트에 배포하시겠습니까?\n(배포 후 약 1분 뒤에 인터넷에 반영됩니다)")) return;
    
    setIsDeploying(true);
    try {
      const res = await fetch('/api/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
      });
      const result = await res.json();
      
      if (result.success) {
        alert('🎉 성공적으로 전송되었습니다!\n\n약 1~2분 뒤에 실제 스마트폰이나 인터넷 주소창에서 사이트 새로고침(F5)을 해보세요.');
      } else {
        alert('❌ 배포 오류 발생:\n' + (result.error || '알 수 없는 에러입니다.'));
      }
    } catch (e) {
      alert('❌ 서버 통신 오류입니다. 프로그램을 완전히 껐다가 다시 실행해 주세요.');
    } finally {
      setIsDeploying(false);
    }
  };

  // Pre-calculations for Preview
  const categoryName = data.categories.find(c => c.id === postData.categoryId)?.name || '정보';
  const solutionSteps = postData.solution ? postData.solution.split('\n').filter(Boolean) : [];

  const handleCopyTistoryHtml = () => {
    if (!postData.title) {
      alert("제목을 먼저 입력해주세요!");
      return;
    }
    
    let html = `
      <div style="font-family: 'Noto Sans KR', sans-serif; color: #333; line-height: 1.8; max-width: 800px; margin: 0 auto;">
        <h1 style="font-size: 24px; color: #111; font-weight: bold; border-bottom: 2px solid #3b82f6; padding-bottom: 10px; margin-bottom: 20px;">
          ${postData.title}
        </h1>
    `;
    
    if (postData.thumbnailUrl) {
      html += `<img src="${postData.thumbnailUrl}" style="width: 100%; border-radius: 12px; margin-bottom: 20px;" alt="썸네일" />`;
    }
    
    html += `
        <blockquote style="background-color: #f8fafc; border-left: 4px solid #3b82f6; padding: 15px 20px; margin: 0 0 30px 0; border-radius: 0 8px 8px 0; color: #475569;">
          <strong>💡 핵심 요약</strong><br/>
          ${postData.summary || ''}
        </blockquote>

        <h2 style="font-size: 20px; color: #1e293b; margin-top: 30px; margin-bottom: 15px;">
          <span style="background-color: #4f46e5; color: white; border-radius: 4px; padding: 2px 8px; font-size: 14px; margin-right: 8px;">1</span> 🚨 문제 및 원인
        </h2>
        <div style="background-color: #fff; border: 1px solid #e2e8f0; padding: 20px; border-radius: 12px; margin-bottom: 30px;">
          <p style="margin-top: 0;"><strong>문제 상황:</strong><br/>${postData.problem.replace(/\n/g, '<br/>')}</p>
          <p style="margin-bottom: 0; margin-top: 15px;"><strong>원인 분석:</strong><br/>${postData.cause.replace(/\n/g, '<br/>')}</p>
        </div>

        <h2 style="font-size: 20px; color: #1e293b; margin-top: 30px; margin-bottom: 15px;">
          <span style="background-color: #4f46e5; color: white; border-radius: 4px; padding: 2px 8px; font-size: 14px; margin-right: 8px;">2</span> 🚀 해결 비법
        </h2>
        <div style="margin-bottom: 30px;">
          ${solutionSteps.map((s, i) => `
            <div style="background-color: #f1f5f9; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
              <strong style="color: #4f46e5;">Step ${i+1}.</strong> ${s.replace(/\n/g, '<br/>')}
            </div>
          `).join('')}
        </div>

        <h2 style="font-size: 20px; color: #1e293b; margin-top: 30px; margin-bottom: 15px;">
          <span style="background-color: #4f46e5; color: white; border-radius: 4px; padding: 2px 8px; font-size: 14px; margin-right: 8px;">3</span> 💡 에디터 특급 꿀팁
        </h2>
        <div style="background-color: #fefce8; border: 1px solid #fef08a; padding: 20px; border-radius: 12px; margin-bottom: 30px; color: #854d0e;">
          ${postData.tips.replace(/\n/g, '<br/>')}
        </div>
        
        <p style="font-size: 16px; font-weight: bold; text-align: center; color: #0f172a; padding: 20px; border-top: 1px dashed #cbd5e1; border-bottom: 1px dashed #cbd5e1; margin-bottom: 40px;">
          ✨ ${postData.conclusion}
        </p>
    `;

    if (postData.recommendationName && postData.recommendationUrl) {
      html += `
        <div style="text-align: center; margin: 40px 0; background-color: #f8fafc; padding: 30px; border-radius: 16px; border: 1px solid #e2e8f0;">
          <div style="font-size: 12px; color: #ef4444; font-weight: bold; margin-bottom: 5px;">🔥 지금 할인 중인 추천 아이템!</div>
          <div style="font-size: 18px; font-weight: bold; margin-bottom: 20px; color: #1e293b;">${postData.recommendationName} <span style="color: #3b82f6;">(${postData.recommendationPrice})</span></div>
          <a href="${postData.recommendationUrl}" target="_blank" style="display: inline-block; background-color: #ef4444; color: white; text-decoration: none; padding: 15px 40px; font-size: 18px; font-weight: bold; border-radius: 50px; box-shadow: 0 4px 6px rgba(239,68,68,0.3);">
            🚀 최저가 확인하러 가기
          </a>
          <p style="font-size: 11px; color: #94a3b8; margin-top: 20px;">이 포스팅은 제휴 마케팅이 포함되어 있으며, 이에 따른 일정액의 수수료를 제공받습니다.</p>
        </div>
      `;
    }

    html += `</div>`;

    navigator.clipboard.writeText(html).then(() => {
      alert("✅ 티스토리용 HTML이 복사되었습니다!\\n\\n티스토리 글쓰기 에디터에서 우측 상단의 '기본모드'를 'HTML'로 변경한 뒤 붙여넣기(Ctrl+V) 하세요.");
    }).catch(err => {
      alert("복사 실패: " + err);
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4">
        <form onSubmit={handleLogin} className="bg-white p-8 rounded-3xl shadow-lg border border-slate-200">
           <h2 className="text-2xl font-black text-slate-800 mb-6 text-center">블로그 Admin</h2>
           <input type="password" value={password} onChange={e => setPassword(e.target.value)} className="w-full px-4 py-3 rounded-xl border mb-4 text-center" placeholder="****" />
           <button type="submit" className="w-full bg-slate-800 text-white font-bold py-3 rounded-xl">로그인</button>
        </form>
      </div>
    );
  }

  return (
    <div className={`container mx-auto px-4 py-8 min-h-screen transition-all duration-300 ${activeTab === 'write' ? 'max-w-7xl' : 'max-w-4xl'}`}>
      <SeoHelmet title="관리자 대시보드" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-slate-800">⚙️ 블로그 CMS 관리자</h1>
        <button 
          onClick={handleDeploy} 
          disabled={isDeploying}
          className={`${isDeploying ? 'bg-slate-400' : 'bg-blue-600 hover:bg-blue-700 shadow-blue-200'} text-white font-black px-5 py-3 rounded-2xl shadow-lg transition-all`}
        >
          {isDeploying ? '⏳ 배포 중...' : '🚀 웹사이트 전체 배포하기'}
        </button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-slate-200 p-1 rounded-2xl">
        <button onClick={() => setActiveTab('write')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'write' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
          📝 작성 및 실시간 미리보기
        </button>
        <button onClick={() => setActiveTab('manage')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'manage' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
          📚 발행 관리
        </button>
        <button onClick={() => setActiveTab('analytics')} className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'analytics' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}>
          📊 방문자 통계 UI
        </button>
      </div>

      {activeTab === 'analytics' && (
        <section className="space-y-6 animate-fade-in">
          {!lookerUrl ? (
            <div className="bg-white border border-slate-200 rounded-3xl p-8 shadow-sm max-w-2xl mx-auto">
              <h2 className="text-2xl font-black text-slate-800 mb-4 flex items-center gap-2">📊 구글 루커 스튜디오 연결</h2>
              <p className="text-slate-600 mb-6 leading-relaxed">
                구글 애널리틱스 데이터를 예쁜 차트로 보여주는 <b>Looker Studio 임베드(Embed) 링크</b>를 입력해 주세요.<br/>
                복잡한 서버 설정 없이 가장 안전하고 확실하게 데이터를 연동할 수 있습니다.
              </p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-slate-700 mb-2">루커 스튜디오 임베드 URL (src 값)</label>
                  <input 
                    type="url" 
                    value={tempLookerUrl} 
                    onChange={e => setTempLookerUrl(e.target.value)} 
                    placeholder="https://lookerstudio.google.com/embed/reporting/..." 
                    className="w-full px-4 py-3 border border-slate-300 rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition"
                  />
                </div>
                <button 
                  onClick={saveLookerUrl}
                  disabled={!tempLookerUrl}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold py-3 rounded-xl transition"
                >
                  🔗 대시보드 연결하기
                </button>
              </div>

              <div className="mt-8 bg-slate-50 p-6 rounded-2xl border border-slate-100 text-sm">
                <h3 className="font-black text-slate-800 mb-3 text-base">💡 임베드 링크 가져오는 방법 (초간단 1분 컷)</h3>
                <ol className="list-decimal list-inside space-y-2 text-slate-700 font-medium">
                  <li><a href="https://lookerstudio.google.com/" target="_blank" rel="noreferrer" className="text-blue-600 font-bold hover:underline">Looker Studio</a>에 접속하여 빈 보고서를 만듭니다.</li>
                  <li>데이터 소스로 <b>Google Analytics</b>를 선택하고 방금 만든 사이트 속성을 연결합니다.</li>
                  <li>차트 추가 버튼을 눌러 원하는 통계(방문자 수 등)를 자유롭게 그립니다.</li>
                  <li>우측 상단의 <b>[공유] ▼ ➔ [보고서 삽입(Embed report)]</b>을 클릭합니다.</li>
                  <li><b>'삽입 URL(Embed URL)'</b>을 선택하고 나오는 주소를 복사해서 위 칸에 붙여넣습니다.</li>
                </ol>
              </div>
            </div>
          ) : (
            <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm flex flex-col h-[800px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h2 className="text-xl font-black text-slate-800 flex items-center gap-2">📊 실시간 애널리틱스 대시보드</h2>
                <button onClick={resetLookerUrl} className="bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-bold px-4 py-2 rounded-lg transition">
                  링크 변경
                </button>
              </div>
              <div className="flex-1 rounded-2xl overflow-hidden border border-slate-200 bg-slate-50">
                <iframe 
                  src={lookerUrl} 
                  width="100%" 
                  height="100%" 
                  frameBorder="0" 
                  style={{ border: 0 }} 
                  allowFullScreen 
                  sandbox="allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox"
                ></iframe>
              </div>
            </div>
          )}
        </section>
      )}

      {activeTab === 'manage' && (
        <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
          <h2 className="text-xl font-bold mb-4">현재 발행된 게시물 목록 ({data.posts.length}건)</h2>
          <div className="space-y-4">
            {data.posts.map(post => (
              <div key={post.id} className="flex flex-col sm:flex-row sm:items-center justify-between p-4 border rounded-xl gap-4 hover:border-slate-300">
                <div>
                  <div className="text-xs text-slate-500 font-bold mb-1">{post.categoryId.toUpperCase()} • {post.date}</div>
                  <h3 className="font-bold text-slate-800">{post.title}</h3>
                </div>
                <div className="flex gap-2 shrink-0">
                  <button onClick={() => loadPublishedPostForEdit(post)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">✏️ 수정</button>
                  <button onClick={() => handleDeletePublishedPost(post.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100">🗑️ 삭제</button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'write' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 relative">
          {/* Left Column: Form Editor */}
          <div className="space-y-6">
            {!editingPostId && (
              <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-black text-indigo-900">📥 AI 자동 작성 대기함 ({drafts.length})</h2>
                  <button onClick={fetchDrafts} className="bg-indigo-200 text-indigo-800 font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1 hover:bg-indigo-300 transition">
                    🔄 새로고침
                  </button>
                </div>
                {drafts.length === 0 ? (
                  <div className="text-center py-6 text-indigo-400 font-bold">대기 중인 초안이 없습니다. 터미널에서 npm run crawl을 실행하세요.</div>
                ) : (
                  <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                    {drafts.map((draft, idx) => (
                      <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 flex items-center justify-between gap-4 hover:shadow-md transition">
                        <div className="truncate flex-1">
                          <h3 className="font-bold text-slate-800 truncate">{draft.title}</h3>
                          <p className="text-xs text-slate-500 mt-1 truncate">{draft.summary}</p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button onClick={() => loadDraft(draft)} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700 transition">불러오기</button>
                          <button onClick={() => removeDraft(draft.id)} className="bg-slate-100 text-slate-500 font-bold px-3 py-2 rounded-lg text-sm hover:bg-slate-200 transition">🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </section>
            )}

            {editingPostId && (
              <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl flex justify-between items-center font-bold">
                <span>⚠️ 현재 발행된 포스트 수정 모드입니다.</span>
                <button onClick={clearForm} className="bg-orange-200 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-300">작성 취소</button>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all">
                <h2 className="text-xl font-bold mb-4">기본 정보</h2>
                <div className="space-y-4">
                  <input type="text" required value={postData.title} onChange={e => setPostData({...postData, title: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition" placeholder="게시글 제목" />
                  <div className="grid grid-cols-2 gap-4">
                    <select value={postData.categoryId} onChange={handleCategoryChange} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition font-bold">
                      {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                    <select 
                      value={postData.subcategory} 
                      onChange={e => setPostData({...postData, subcategory: e.target.value})} 
                      className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition font-bold"
                      disabled={!data.categories.find(c => c.id === postData.categoryId)?.subcategories?.length}
                    >
                      <option value="">서브 카테고리 (옵션)</option>
                      {data.categories.find(c => c.id === postData.categoryId)?.subcategories?.map(sub => (
                        <option key={sub} value={sub}>{sub}</option>
                      ))}
                    </select>
                  </div>
                  <input type="url" value={postData.thumbnailUrl} onChange={e => setPostData({...postData, thumbnailUrl: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition" placeholder="썸네일 이미지 URL (또는 비워두기)" />
                  <textarea required value={postData.summary} onChange={e => setPostData({...postData, summary: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition h-24" placeholder="짧은 핵심 요약 (이 내용이 구글 검색 결과의 디스크립션으로 자동 등록됩니다)"></textarea>
                </div>
              </section>

              <section className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm focus-within:border-blue-300 focus-within:shadow-md transition-all">
                 <h2 className="text-xl font-bold mb-4">본문 구조화 작성</h2>
                 <div className="space-y-4">
                   <textarea required value={postData.problem} onChange={e => setPostData({...postData, problem: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition" placeholder="1. 🚨 문제 상황 설명"></textarea>
                   <textarea required value={postData.cause} onChange={e => setPostData({...postData, cause: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition" placeholder="2. 🔍 원인 분석"></textarea>
                   <textarea required value={postData.solution} onChange={e => setPostData({...postData, solution: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition h-32" placeholder="3. 🚀 단계별 해결 방법 (엔터로 구분해서 입력 시 자동으로 넘버링 리스트업 됩니다)"></textarea>
                   <textarea required value={postData.tips} onChange={e => setPostData({...postData, tips: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition" placeholder="4. 💡 에디터 추가 꿀팁"></textarea>
                   <textarea required value={postData.conclusion} onChange={e => setPostData({...postData, conclusion: e.target.value})} className="w-full px-4 py-3 border rounded-xl bg-slate-50 focus:bg-white focus:border-blue-500 outline-none transition" placeholder="5. ✨ 요약 및 기대 효과 (한 줄 정리)"></textarea>
                 </div>
              </section>

              <section className="bg-blue-50 p-6 rounded-3xl border border-blue-200 shadow-sm focus-within:border-blue-400 focus-within:shadow-md transition-all">
                 <h2 className="text-xl font-bold text-blue-900 mb-4">💎 추천 상품 제휴 링크 (쿠팡 버튼)</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                   <input type="text" value={postData.recommendationName} onChange={e => setPostData({...postData, recommendationName: e.target.value})} className="w-full px-4 py-3 border border-blue-100 rounded-xl bg-white focus:border-blue-500 outline-none" placeholder="상품명 (예: 산소계 표백제)" />
                   <input type="text" value={postData.recommendationPrice} onChange={e => setPostData({...postData, recommendationPrice: e.target.value})} className="w-full px-4 py-3 border border-blue-100 rounded-xl bg-white focus:border-blue-500 outline-none" placeholder="할인 가격 (예: 12,000원)" />
                   <input type="url" value={postData.recommendationUrl} onChange={e => setPostData({...postData, recommendationUrl: e.target.value})} className="w-full px-4 py-3 border border-blue-100 rounded-xl bg-white focus:border-blue-500 outline-none" placeholder="제휴 URL (https://...)" />
                 </div>
              </section>

              <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-200 shadow-sm focus-within:border-emerald-400 transition-all">
                 <h2 className="text-xl font-bold text-emerald-900 mb-4">🙋‍♂️ FAQ (AEO 최적화 답변 섹션)</h2>
                 <p className="text-xs text-emerald-700 mb-4 font-bold">구글 검색 시 '질문-답변' 리치 결과로 노출될 확률을 높입니다.</p>
                 <div className="space-y-4">
                   {postData.faqs.map((faq, idx) => (
                     <div key={idx} className="p-4 bg-white rounded-2xl border border-emerald-100 space-y-2">
                       <div className="flex gap-2 items-center">
                         <span className="bg-emerald-600 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold">Q</span>
                         <input 
                            type="text" 
                            value={faq.q} 
                            onChange={e => handleFaqChange(idx, 'q', e.target.value)} 
                            className="flex-1 px-3 py-2 border rounded-lg outline-none focus:border-emerald-500" 
                            placeholder="사용자가 검색할만한 질문 (예: 곰팡이 방지법은?)"
                         />
                       </div>
                       <div className="flex gap-2 items-start">
                         <span className="bg-slate-800 text-white w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold mt-2">A</span>
                         <textarea 
                            value={faq.a} 
                            onChange={e => handleFaqChange(idx, 'a', e.target.value)} 
                            className="flex-1 px-3 py-2 border rounded-lg outline-none focus:border-emerald-500 h-20" 
                            placeholder="명확하고 친절한 답변 (구글 검색 결과에 직접 노출됩니다)"
                         />
                       </div>
                     </div>
                   ))}
                 </div>
              </section>

              <button type="submit" className={`w-full text-white font-black text-lg py-5 rounded-2xl shadow-xl transition transform hover:-translate-y-1 ${editingPostId ? 'bg-orange-600 hover:bg-orange-700 shadow-orange-200' : 'bg-slate-800 hover:bg-slate-900 shadow-slate-300'}`}>
                {editingPostId ? '🔄 수정한 내용으로 재발행하기' : '🚀 구조화 포스팅 확정 및 퍼블리싱'}
              </button>
            </form>
          </div>

          {/* Right Column: Live Preview Pane */}
          <div className="hidden lg:block relative">
            <div className="sticky top-6 flex flex-col h-[calc(100vh-3rem)]">
              
              {/* Tistory Copy Button */}
              <div className="bg-gradient-to-r from-orange-500 to-red-500 p-4 rounded-3xl shadow-lg mb-4 flex items-center justify-between shrink-0">
                <div>
                  <h3 className="text-white font-black text-lg flex items-center gap-2"><span>📝</span> 티스토리 자동 복사기</h3>
                  <p className="text-orange-100 text-[11px] mt-0.5 font-medium">티스토리 HTML 모드에서 붙여넣기만 하세요!</p>
                </div>
                <button type="button" onClick={handleCopyTistoryHtml} className="bg-white text-orange-600 font-black px-4 py-2.5 rounded-xl shadow-sm hover:scale-105 hover:shadow-md transition transform text-sm">
                  📋 HTML 1초 복사
                </button>
              </div>

              {/* 1. SEO Meta Preview */}
              <div className="bg-white p-5 rounded-3xl shadow-sm border border-slate-200 mb-6 shrink-0">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-black text-slate-700 flex items-center gap-2"><span>🔍</span> 구글 검색 노출 미리보기</h3>
                  <span className="bg-green-100 text-green-700 text-[10px] font-bold px-2 py-1 rounded">자동 SEO 설정 켜짐</span>
                </div>
                <div className="bg-slate-50 p-4 rounded-xl border border-slate-100 cursor-default">
                  <div className="text-[12px] text-slate-500 truncate mb-1">https://lifestyle-hub.co.kr {'>'} post {'>'} {postData.title ? postData.title.toLowerCase().replace(/\s+/g, '-') : '...'}</div>
                  <div className="text-[20px] font-bold text-[#1a0dab] hover:underline cursor-pointer truncate">
                    {postData.title || '게시글 제목이 여기에 표시됩니다'}
                  </div>
                  <div className="text-[13px] text-[#4d5156] mt-1 line-clamp-2 leading-relaxed">
                    {postData.summary || '게시글의 핵심 요약 내용이 자동으로 메타태그(meta description)에 삽입되어, 구글 검색 결과 텍스트로 노출됩니다. 방문자의 클릭을 유도할 수 있도록 매력적으로 작성하세요.'}
                  </div>
                </div>
              </div>

              {/* 2. Mobile Device Mockup for Post Detail */}
              <div className="flex-1 bg-slate-900 rounded-[2.5rem] overflow-hidden border-[8px] border-slate-900 shadow-2xl relative max-w-[380px] mx-auto w-full flex flex-col animate-fade-in">
                {/* iPhone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 bg-slate-900 rounded-b-2xl w-36 mx-auto z-50"></div>
                
                {/* Screen Content */}
                <div className="flex-1 bg-white overflow-y-auto hide-scrollbar relative">
                  
                  {/* Fake Browser Header */}
                  <div className="bg-slate-50 pt-8 pb-3 px-4 border-b border-slate-200 flex justify-center sticky top-0 z-40">
                    <div className="bg-slate-200 rounded-full h-6 w-3/4 flex items-center justify-center text-[10px] text-slate-500 font-bold">lifestyle-hub.co.kr</div>
                  </div>

                  <div className="p-5 pb-24">
                    <div className="text-xs text-indigo-600 font-bold mb-2 uppercase">{categoryName}</div>
                    <h1 className="text-2xl font-black text-slate-900 leading-tight mb-4">
                      {postData.title || '제목을 입력하세요'}
                    </h1>
                    
                    {postData.thumbnailUrl ? (
                       <img src={postData.thumbnailUrl} className="w-full aspect-[16/9] object-cover rounded-xl mb-6 shadow-sm" alt="thumb"/>
                    ) : (
                       <div className="w-full aspect-[16/9] bg-slate-100 rounded-xl mb-6 flex items-center justify-center text-slate-300 font-bold">이미지 없음</div>
                    )}

                    {/* AI Summary Box */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-l-4 border-indigo-600 p-4 rounded-r-xl mb-8 shadow-sm">
                      <h2 className="text-sm font-black text-indigo-900 mb-3 flex items-center gap-1">💡 AI 핵심 요약 (AEO 봇 수집)</h2>
                      <ul className="space-y-2 bg-white/70 p-3 rounded-lg text-[13px]">
                        <li className="flex gap-2"><span className="text-red-500 font-bold shrink-0">🎯 문제:</span> <span className="line-clamp-1 text-slate-700">{postData.cause || '-'}</span></li>
                        <li className="flex gap-2"><span className="text-indigo-600 font-bold shrink-0">🚀 해결:</span> <span className="line-clamp-1 text-slate-700">{solutionSteps[0] || '-'}</span></li>
                        <li className="flex gap-2"><span className="text-green-600 font-bold shrink-0">✨ 효과:</span> <span className="line-clamp-1 text-slate-700">{postData.conclusion || '-'}</span></li>
                      </ul>
                    </div>

                    {/* Content Prose */}
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-2"><span className="bg-indigo-600 text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px]">1</span> 발생 원인 및 문제점</h3>
                        <p className="bg-white border border-slate-100 shadow-sm p-4 rounded-xl text-[13px] text-slate-600 leading-relaxed"><strong className="text-red-600">🚨 문제 상황:</strong><br/>{postData.problem || '-'}<br/><br/><strong className="text-indigo-600">🔍 원인 분석:</strong><br/>{postData.cause || '-'}</p>
                      </div>
                      
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-2"><span className="bg-indigo-600 text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px]">2</span> 단계별 해결 방법</h3>
                        <div className="space-y-2">
                          {solutionSteps.length > 0 ? solutionSteps.map((s, i) => (
                            <div key={i} className="bg-white border border-slate-100 shadow-sm p-3 rounded-xl text-[13px] text-slate-700 flex gap-2 items-start"><span className="bg-slate-100 text-indigo-600 w-5 h-5 rounded-full flex items-center justify-center shrink-0 font-bold text-[10px]">{i+1}</span><span className="mt-0.5">{s}</span></div>
                          )) : <div className="bg-slate-50 p-3 rounded-xl text-xs text-slate-400 text-center">해결 방법을 입력하세요</div>}
                        </div>
                      </div>

                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2 mb-2"><span className="bg-indigo-600 text-white w-5 h-5 rounded-md flex items-center justify-center text-[10px]">3</span> 에디터 꿀팁</h3>
                        <p className="bg-yellow-50 border border-yellow-100 p-4 rounded-xl text-[13px] text-slate-700 leading-relaxed flex gap-2"><span className="text-lg">💡</span> {postData.tips || '-'}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sticky Mobile CTA Preview */}
                  {postData.recommendationName && postData.recommendationUrl && (
                     <div className="absolute bottom-0 left-0 right-0 p-4 bg-white/95 backdrop-blur-md border-t border-slate-200 shadow-[0_-5px_20px_rgba(0,0,0,0.05)] animate-slide-up">
                       <div className="flex justify-between items-center gap-3">
                         <div className="flex-1 min-w-0">
                           <div className="text-[10px] text-indigo-600 font-bold mb-0.5">🔥 지금 할인 중</div>
                           <div className="text-sm font-bold text-slate-900 truncate">{postData.recommendationName}</div>
                         </div>
                         <div className="bg-indigo-600 text-white px-4 py-2.5 rounded-lg text-sm font-black shrink-0">🚀 최저가 확인</div>
                       </div>
                     </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      {/* Styles for animations */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes fade-in { from { opacity: 0; } to { opacity: 1; } }
        @keyframes slide-up { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
        .animate-fade-in { animation: fade-in 0.3s ease-out forwards; }
        .animate-slide-up { animation: slide-up 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}} />
    </div>
  );
}
