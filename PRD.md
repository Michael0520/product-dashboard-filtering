實作題 (每題 50 分)
以下實作請附上 Github 連結供參考
創建一個複雜篩選功能，用於篩選一組物品（如商品清單）。清單資料為靜態 JSON，包含屬
性：name（名稱）、category（類別）、price（價格）、inStock（是否有庫存）。

1. 資料來源：
o 使用 items.json，包含 10,000 筆資料，模擬大型數據集。
o 每筆資料包含屬性：

```javascript
[{
&quot;name&quot;: &quot;Item 1&quot;,
&quot;category&quot;: &quot;A&quot;,
&quot;price&quot;: 100,
&quot;inStock&quot;: true
}]
```

2. 篩選條件：
o 類別篩選：允許用戶多選類別，名稱關鍵字搜尋。
o 價格範圍篩選：支援用戶輸入最低和最高價格。
o 庫存篩選：用戶可選擇是否僅顯示「有庫存」的商品。
3. 排序功能：
o 支援按價格升序、降序排列。
o 需要考量效能問題局部顯示 (Virtual Scrolling or Pagination)
4. RWD（響應式設計）需求：
o 桌面端：商品以表格形式顯示，每行顯示一個商品。
o 手機端：商品以卡片形式顯示，每行顯示最多兩個商品。
5. 歡迎在基礎上面加上你覺得可以優化的功能 (加分項)

範例效果參考：
1. 桌面端：
o 顯示商品表格，類似：

```css
| 商品名稱 | 類別 | 價格 | 有庫存 |
|----------|------|------|--------|
| Item 1 | A | 100 | 是 |
```

2. 手機端：

o 顯示卡片樣式，類似：

```css
[商品名稱] Item 1
[類別] A
[價格] $100
[庫存] 有庫存
```
----

## 狀態管理

使用 [zustand](https://github.com/pmndrs/zustand)
目前已經安裝好再 packjson，在但還沒有 initial setup 相關檔案

## 資料串接

資料存在放 @data/data.json

是一個有一萬比數的 json file，需要模擬 api 的方式來串接，套件選擇了 [react-query](https://tanstack.com/query/latest/docs/framework/react/overview)

並且搭配他們的 @tanstack/react-virtual 來優化大量資料的觀看體驗