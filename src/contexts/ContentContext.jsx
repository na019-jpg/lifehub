import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/content.json';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const STORAGE_KEY = 'lifehub_content_v4';
  
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        // --- 핵심 캐시 병합 로직 (서버 업데이트 반영) ---
        const existingIds = new Set((parsed.posts || []).map(p => p.id));
        const newPostsFromServer = initialData.posts.filter(p => !existingIds.has(p.id));
        
        return {
          ...initialData, // 최신 필드(tools, toolCategories 등) 기본값 확보
          ...parsed,
          posts: [...newPostsFromServer, ...(parsed.posts || [])],
          // UI 구조 관련 필드는 무조건 최신 서버 구조를 강제 반영
          categories: initialData.categories,
          toolCategories: initialData.toolCategories,
          tools: initialData.tools
        };
      } catch (e) {
        console.error("Local storage data parsing error", e);
      }
    }
    return initialData;
  });

  // Save to local storage whenever data changes
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
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
