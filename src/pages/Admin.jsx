import React, { useState } from 'react';
import { useContent } from '../contexts/ContentContext';
import SeoHelmet from '../components/SeoHelmet';

export default function Admin() {
  const { data, addPost, updatePost, deletePost } = useContent();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  
  // Tabs State: 'write' or 'manage'
  const [activeTab, setActiveTab] = useState('write');
  
  // Edit State
  const [editingPostId, setEditingPostId] = useState(null);

  // Form State
  const [postData, setPostData] = useState({
    title: '', categoryId: 'clean', subcategory: '', summary: '', thumbnailUrl: '',
    problem: '', cause: '', solution: '', tips: '', conclusion: '',
    recommendationName: '', recommendationUrl: '', recommendationPrice: ''
  });

  // Automatically update subcategory when category changes to prevent invalid state
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
    });
    window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
  };

  const removeDraft = (draftId) => {
    // 임시보관함에서 숨김 처리 (localStorage에 저장)
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
      title: '', categoryId: 'clean', subcategory: '', summary: '', thumbnailUrl: '',
      problem: '', cause: '', solution: '', tips: '', conclusion: '',
      recommendationName: '', recommendationUrl: '', recommendationPrice: ''
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
      }
    };

    if (editingPostId) {
      // Update existing post
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
      // Create new post
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

      // Remove published draft from inbox
      if (currentDraftId) {
        const published = JSON.parse(localStorage.getItem('published_drafts') || '[]');
        published.push(currentDraftId);
        localStorage.setItem('published_drafts', JSON.stringify(published));
        setDrafts(prev => prev.filter(d => d.id !== currentDraftId));
      }
    }

    clearForm();
  };

  const exportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(data, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href",     dataStr);
    downloadAnchorNode.setAttribute("download", "content.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
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
    <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen">
      <SeoHelmet title="관리자 대시보드" />
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-3xl font-black text-slate-800">⚙️ 블로그 CMS 관리자</h1>
        <button onClick={exportJSON} className="bg-green-100 text-green-700 font-bold px-4 py-2 rounded-xl text-sm">⬇️ JSON 다운로드</button>
      </div>

      {/* Tabs */}
      <div className="flex space-x-2 mb-8 bg-slate-200 p-1 rounded-2xl">
        <button 
          onClick={() => setActiveTab('write')}
          className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'write' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          📝 새 글 쓰기 & 봇 대기함
        </button>
        <button 
          onClick={() => setActiveTab('manage')}
          className={`flex-1 py-3 rounded-xl font-bold transition-colors ${activeTab === 'manage' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-500 hover:text-slate-800'}`}
        >
          📚 발행된 글 관리
        </button>
      </div>

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
                  <button onClick={() => loadPublishedPostForEdit(post)} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg font-bold text-sm hover:bg-slate-200">
                    ✏️ 수정
                  </button>
                  <button onClick={() => handleDeletePublishedPost(post.id)} className="bg-red-50 text-red-600 px-4 py-2 rounded-lg font-bold text-sm hover:bg-red-100">
                    🗑️ 삭제
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {activeTab === 'write' && (
        <>
          {/* Inbox Section */}
          {!editingPostId && (
            <section className="bg-indigo-50 p-6 rounded-3xl border border-indigo-100 mb-8">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-black text-indigo-900">📥 AI 자동 작성 대기함 ({drafts.length})</h2>
                <button onClick={fetchDrafts} className="bg-indigo-200 text-indigo-800 font-bold px-3 py-1.5 rounded-lg text-sm flex items-center gap-1">
                  🔄 다시 불러오기
                </button>
              </div>
              
              {drafts.length === 0 ? (
                <div className="text-center py-6 text-indigo-400 font-bold">
                  대기 중인 초안이 없습니다. 터미널에서 npm run crawl을 실행하세요.
                </div>
              ) : (
                <div className="space-y-3 max-h-60 overflow-y-auto pr-2">
                  {drafts.map((draft, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-xl shadow-sm border border-indigo-50 flex items-center justify-between gap-4">
                      <div className="truncate flex-1">
                        <h3 className="font-bold text-slate-800 truncate">{draft.title}</h3>
                        <p className="text-xs text-slate-500 mt-1 truncate">{draft.summary}</p>
                      </div>
                      <div className="flex gap-2 shrink-0">
                        <button onClick={() => loadDraft(draft)} className="bg-indigo-600 text-white font-bold px-4 py-2 rounded-lg text-sm hover:bg-indigo-700">불러오기</button>
                        <button onClick={() => removeDraft(draft.id)} className="bg-slate-100 text-slate-500 font-bold px-3 py-2 rounded-lg text-sm hover:bg-slate-200">🗑️</button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          )}

          {/* Form Banner for Edit Mode */}
          {editingPostId && (
            <div className="bg-orange-50 border border-orange-200 text-orange-800 p-4 rounded-xl mb-6 flex justify-between items-center font-bold">
              <span>⚠️ 현재 발행된 포스트 수정 모드입니다.</span>
              <button onClick={clearForm} className="bg-orange-200 px-3 py-1.5 rounded-lg text-sm hover:bg-orange-300">작성 취소</button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <section className="bg-white p-6 rounded-3xl border border-slate-200">
              <h2 className="text-xl font-bold mb-4">기본 정보</h2>
              <div className="space-y-4">
                <input type="text" required value={postData.title} onChange={e => setPostData({...postData, title: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="게시글 제목" />
                <div className="grid grid-cols-2 gap-4">
                  <select value={postData.categoryId} onChange={handleCategoryChange} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition">
                    {data.categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                  <select 
                    value={postData.subcategory} 
                    onChange={e => setPostData({...postData, subcategory: e.target.value})} 
                    className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition"
                    disabled={!data.categories.find(c => c.id === postData.categoryId)?.subcategories?.length}
                  >
                    <option value="">서브 카테고리 선택</option>
                    {data.categories.find(c => c.id === postData.categoryId)?.subcategories?.map(sub => (
                      <option key={sub} value={sub}>{sub}</option>
                    ))}
                  </select>
                </div>
                <input type="url" value={postData.thumbnailUrl} onChange={e => setPostData({...postData, thumbnailUrl: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="썸네일 URL (또는 비워두기)" />
                <textarea required value={postData.summary} onChange={e => setPostData({...postData, summary: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="짧은 요약 (리스트 및 인트로용)"></textarea>
              </div>
            </section>

            <section className="bg-white p-6 rounded-3xl border border-slate-200">
               <h2 className="text-xl font-bold mb-4">본문 구조화 작성</h2>
               <div className="space-y-4">
                 <textarea required value={postData.problem} onChange={e => setPostData({...postData, problem: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="1. 문제 설명"></textarea>
                 <textarea required value={postData.cause} onChange={e => setPostData({...postData, cause: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="2. 원인 분석"></textarea>
                 <textarea required value={postData.solution} onChange={e => setPostData({...postData, solution: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition h-32" placeholder="3. 단계별 해결 방법 (엔터로 구분해서 리스트업 하세요)"></textarea>
                 <textarea required value={postData.tips} onChange={e => setPostData({...postData, tips: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="4. 추가 꿀팁"></textarea>
                 <textarea required value={postData.conclusion} onChange={e => setPostData({...postData, conclusion: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-slate-50 focus:bg-white transition" placeholder="5. 요약 정리 (따옴표 안에 들어감)"></textarea>
               </div>
            </section>

            <section className="bg-blue-50 p-6 rounded-3xl border border-blue-100">
               <h2 className="text-xl font-bold text-blue-800 mb-4">추천 제품 (쿠팡 버튼)</h2>
               <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                 <input type="text" value={postData.recommendationName} onChange={e => setPostData({...postData, recommendationName: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white" placeholder="상품명 (예: 산소계 표백제)" />
                 <input type="text" value={postData.recommendationPrice} onChange={e => setPostData({...postData, recommendationPrice: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white" placeholder="가격 (예: 12,000원)" />
                 <input type="url" value={postData.recommendationUrl} onChange={e => setPostData({...postData, recommendationUrl: e.target.value})} className="w-full px-4 py-2 border rounded-xl bg-white" placeholder="제휴 링크 (https://...)" />
               </div>
            </section>

            <button type="submit" className={`w-full text-white font-black text-lg py-4 rounded-xl transition ${editingPostId ? 'bg-orange-600 hover:bg-orange-700' : 'bg-slate-800 hover:bg-slate-900'}`}>
              {editingPostId ? '🔄 현재 게시글 정보 변경(수정)' : '🚀 새로운 포스팅 승인 및 퍼블리싱'}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
