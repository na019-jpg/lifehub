import re
import os

path = 'src/pages/PostDetail.jsx'
with open(path, 'r', encoding='utf-8') as f:
    content = f.read()

# 1. Add useMemo and ScrollProgressBar
if "ScrollProgressBar" not in content:
    content = content.replace(
        "import React, { useState, useEffect } from 'react';",
        "import React, { useState, useEffect, useMemo } from 'react';\n\nconst ScrollProgressBar = () => {\n  const [scrollProgress, setScrollProgress] = useState(0);\n\n  useEffect(() => {\n    let ticking = false;\n    const handleScroll = () => {\n      if (!ticking) {\n        window.requestAnimationFrame(() => {\n          const totalScroll = document.documentElement.scrollTop || document.body.scrollTop;\n          const windowHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;\n          if (windowHeight > 0) {\n            setScrollProgress((totalScroll / windowHeight) * 100);\n          }\n          ticking = false;\n        });\n        ticking = true;\n      }\n    };\n    window.addEventListener('scroll', handleScroll, { passive: true });\n    return () => window.removeEventListener('scroll', handleScroll);\n  }, []);\n\n  return (\n    <div \n      className=\"fixed top-0 left-0 h-1.5 bg-indigo-600 z-[100] transition-all duration-150 ease-out\" \n      style={{ width: f'{scrollProgress}%' }}\n    ></div>\n  );\n};\n"
    )
    # Fix the Python f-string interpolation artifact into JS template string
    content = content.replace("style={{ width: f'{scrollProgress}%' }}", "style={{ width: `${scrollProgress}%` }}")

# 2. Remove old scroll logic
old_scroll_logic = re.compile(r"  // 1\. Scroll Progress State\s+const \[scrollProgress, setScrollProgress\] = useState\(0\);\s+useEffect\(\(\) => \{\s+const handleScroll = \(\) => \{\s+const totalScroll = document\.documentElement\.scrollTop \|\| document\.body\.scrollTop;\s+const windowHeight = document\.documentElement\.scrollHeight - document\.documentElement\.clientHeight;\s+if \(windowHeight === 0\) return;\s+const scroll = `\$\{totalScroll / windowHeight\}`;\s+setScrollProgress\(scroll \* 100\);\s+\};\s+window\.addEventListener\('scroll', handleScroll\);\s+return \(\) => window\.removeEventListener\('scroll', handleScroll\);\s+\}, \[\]\);", re.MULTILINE)
content = re.sub(old_scroll_logic, "  // 1. Scroll Progress State is managed by ScrollProgressBar", content)

# 3. Replace old matching logic
old_matching = re.compile(r"  // 5\. Keyword Matching Logic for ProductCard\s+let matchedProduct = null;\s+const searchString = `\$\{post\.title\} \$\{post\.tags \|\| ''\} \$\{post\.summary\}`\.toLowerCase\(\);\s+for \(const \[key, product\] of Object\.entries\(affiliateProducts\)\) \{\s+if \(searchString\.includes\(key\)\) \{\s+matchedProduct = product;\s+break; \s+\}\s+\}", re.MULTILINE)
new_matching = """  // 5. Keyword Matching Logic for ProductCard (Memoized)
  const matchedProduct = useMemo(() => {
    const searchString = `${post.title} ${post.tags || ''} ${post.summary}`.toLowerCase();
    for (const [key, product] of Object.entries(affiliateProducts)) {
      if (searchString.includes(key)) {
        return product;
      }
    }
    return null;
  }, [post]);"""
content = re.sub(old_matching, new_matching, content)

# 4. Replace the div
old_div = re.compile(r"      \{\/\* 1\. Scroll Progress Bar \*\/යට      <div \s+className=\"fixed top-0 left-0 h-1\.5 bg-indigo-600 z-\[100\] transition-all duration-150 ease-out\" \s+style=\{\{ width: `\$\{scrollProgress\}%` \}\}\s+><\/div>", re.MULTILINE)
# The unicode character above is used to match any whitespace since \s matches newlines
content = re.sub(r"      \{\/\* 1\. Scroll Progress Bar \*\/\}\s*<div\s+className=\"fixed top-0 left-0 h-1\.5 bg-indigo-600 z-\[100\] transition-all duration-150 ease-out\"\s+style=\{\{\s*width:\s*`\$\{scrollProgress\}%`\s*\}\}\s*><\/div>", "      {/* 1. Scroll Progress Bar */}\n      <ScrollProgressBar />", content)

with open(path, 'w', encoding='utf-8') as f:
    f.write(content)
print('Done!')
