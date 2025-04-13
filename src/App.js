import logo from './logo.svg';
import './App.css';

import React, { useState, useEffect } from 'react';

function App() {
  // データ、カテゴリ、分野の選択状態を管理
  const [data, setData] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  useEffect(() => {
    fetch('exam_data.json')
      .then((response) => response.json())
      .then((jsonData) => {
        setData(jsonData);
        // 初期状態として、最初のカテゴリとそのカテゴリの最初の分野を選択する
        const categories = [...new Set(jsonData.map(item => item.category))].sort();
        if (categories.length > 0) {
          setSelectedCategory(categories[0]);
          const subjects = [...new Set(
            jsonData.filter(item => item.category === categories[0])
                    .map(item => item.subject)
          )].sort();
          if (subjects.length > 0) {
            setSelectedSubject(subjects[0]);
          }
        }
      })
      .catch((error) => {
        console.error("JSONデータの読み込みに失敗しました", error);
      });
  }, []);

  // カテゴリ一覧を算出（重複を除去してソート）
  const categories = [...new Set(data.map(item => item.category))].sort();

  // 現在選択されたカテゴリに該当する分野一覧を算出
  const subjects = [...new Set(
    data.filter(item => item.category === selectedCategory)
        .map(item => item.subject)
  )].sort();

  // 選択されたカテゴリおよび分野でフィルタリングした結果
  const filteredResults = data.filter(item => 
    item.category === selectedCategory && item.subject === selectedSubject
  );

  // カテゴリが変更されたときは対応する最初の分野を自動設定
  useEffect(() => {
    const subjectsForCategory = [...new Set(
      data.filter(item => item.category === selectedCategory)
          .map(item => item.subject)
    )].sort();
    if (subjectsForCategory.length > 0) {
      setSelectedSubject(subjectsForCategory[0]);
    } else {
      setSelectedSubject('');
    }
  }, [selectedCategory, data]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>出題履歴検索11年分</h1>

      <div style={{ marginBottom: '20px' }}>
        <label htmlFor="category-select">カテゴリを選択: </label>
        <select
          id="category-select"
          value={selectedCategory}
          onChange={(e) => setSelectedCategory(e.target.value)}
        >
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      {selectedCategory && (
        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="subject-select">分野を選択: </label>
          <select
            id="subject-select"
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
          >
            {subjects.map((subject) => (
              <option key={subject} value={subject}>
                {subject}
              </option>
            ))}
          </select>
        </div>
      )}

      <div>
        <h2>検索結果</h2>
        <ul>
          {filteredResults.map((item, index) => (
            <li key={index}>
              {item.year}年：{item.problem}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export default App;
