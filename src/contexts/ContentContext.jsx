import React, { createContext, useContext, useState, useEffect } from 'react';
import initialData from '../data/content.json';

const ContentContext = createContext();

export function ContentProvider({ children }) {
  const STORAGE_KEY = 'lifehub_content_v5';
  
  const [data, setData] = useState(() => {
    const savedData = localStorage.getItem(STORAGE_KEY);
    if (savedData) {
      try {
        const parsed = JSON.parse(savedData);
        
        return {
          ...initialData,
          ...parsed,
          // Always use the latest structure for tools and categories from server
          categories: initialData.categories,
          toolCategories: initialData.toolCategories,
          tools: initialData.tools,
          // Merge posts (keep user added ones if any, but prioritize server ones)
          posts: initialData.posts // For now, let's just use server posts to ensure everything is synced
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
