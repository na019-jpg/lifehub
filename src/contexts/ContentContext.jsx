import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/content.json';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem('bloghub_content_v2');
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // --- 핵심 캐시 병합 로직 (서버 업데이트 반영) ---
        // 브라우저 캐시에 없는 새로운 포스트가 서버(initialData)에 배포되었다면, 그것만 쏙 빼서 강제 병합합니다.
        const existingIds = new Set(parsed.posts.map(p => p.id));
        const newPostsFromServer = initialData.posts.filter(p => !existingIds.has(p.id));
        parsed.posts = [...newPostsFromServer, ...parsed.posts];
        
        // 카테고리 구조 등은 무조건 최신 서버 구조를 강제 반영
        parsed.categories = initialData.categories;
        return parsed;
      } catch (e) {
        console.error("Local storage data parsing error", e);
      }
    }
    return initialData;
  });

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem('bloghub_content_v2', JSON.stringify(data));
  }, [data]);

  const addPost = (newPost) => {
    // Generate a simple ID and slug if not provided
    const id = newPost.id || `post-${Date.now()}`;
    const slug = newPost.slug || id;
    const postWithMeta = { ...newPost, id, slug };
    
    setData(prev => ({
      ...prev,
      posts: [postWithMeta, ...prev.posts]
    }));
  };

  const updatePost = (id, updatedPost) => {
    setData(prev => ({
      ...prev,
      posts: prev.posts.map(post => post.id === id ? { ...post, ...updatedPost } : post)
    }));
  };

  const deletePost = (id) => {
    setData(prev => ({
      ...prev,
      posts: prev.posts.filter(post => post.id !== id)
    }));
  };

  return (
    <ContentContext.Provider value={{ data, addPost, updatePost, deletePost }}>
      {children}
    </ContentContext.Provider>
  );
}

export function useContent() {
  return useContext(ContentContext);
}
