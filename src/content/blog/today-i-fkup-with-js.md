---
title: Today I fkup with JavaScript
excerpt: Tính mỗi năm viết một bài blog thôi, nhưng mà mới đây mình có gặp một quả bug thế giới quá, sau một hồi mày mò và tìm hiểu, mình quyết định viết một cái write up ngắn gọn để chửi ngôn ngữ kiếm tiền cho mình - JavaScript.
date: Aug 26, 2023
image: /assets/blog/today-i-fkup-with-js/featured.png
tags: [javascript, writeup]
---

Tính mỗi năm viết một bài blog thôi, nhưng mà mới đây mình có gặp một quả bug thế giới quá, sau một hồi mày mò và tìm hiểu, mình quyết định viết một cái write up ngắn gọn để chửi ngôn ngữ kiếm tiền cho mình - JavaScript.

## Bài toán

Chả là hôm nọ mình research một vài vấn đề liên quan tới mấy cái feature sắp tới, bài toán là: *"Làm sao để đánh giá chính xác một đối tượng có được rating cao hay không chỉ dựa vào việc người dùng đánh giá tích cực/tiêu cực về đối tượng đó"*?

Bằng vào kỹ năng Google đỉnh cao của mình, mình tìm được bài viết [How Not To Sort By Average Rating](https://www.evanmiller.org/how-not-to-sort-by-average-rating.html) của bác *Evan Miller*. Bài này có chỉ ra về việc một số hệ thống đánh giá thời bấy giờ có độ đúng đắn khá thấp nếu chúng ta chỉ suy nghĩ theo cách đơn giản.

Có rất nhiều hệ thống đang sai lầm trong việc làm sao để listing được một cách chính xác nhất về điểm đánh giá đối tượng. Các bạn có thể đọc trong bài, cũng khá dễ hiểu. Tóm lại thì cách khả thi và có độ chính xác tương đối có thể chấp nhận là sử dụng công thức [Wilson Lower Bound](https://en.wikipedia.org/wiki/Binomial_proportion_confidence_interval?useskin=vector#Wilson_score_interval) của nhà toán học *Edwin Bidwell Wilson*.

Vì mình cần làm một ví dụ nho nhỏ có làm một cái PoC nho nhỏ, convert nhanh thuật toán Ruby trong bài sang JavaScript, trông nó sẽ như thế này:

```js
var pnormaldist = function(qn) {
    var b = [1.570796288, 0.03706987906, -0.8364353589e-3,
            -0.2250947176e-3, 0.6841218299e-5, 0.5824238515e-5,
            -0.104527497e-5, 0.8360937017e-7, -0.3231081277e-8,
            0.3657763036e-10, 0.6936233982e-12
        ],
        w1 = qn,
        w3 = -Math.log(4.0 * w1 * (1.0 - w1)),
        i = 1;

    if (qn < 0.0 || qn > 1.0) {
        return 0.0;
    }
    if (qn === 0.5) {
        return 0.0;
    }
    if (qn > 0.5) {
        w1 = 1.0 - w1;
    }

    w1 = b[0];
    for (i; i < 11; i++) {
        w1 += b[i] * Math.pow(w3, i);
    }

    if (qn > 0.5) {
        return Math.sqrt(w1 * w3);
    }

    return -Math.sqrt(w1 * w3);
};

function ci_lower_bound(pos, n, confidence = 0.95) {
    if (n === 0) {
        return 0;
    }
    var z = pnormaldist(1 - (1 - confidence) / 2);
    var phat = 1.0 * pos / n;
    return (phat + z * z / (2 * n) - z * Math.sqrt((phat * (1 - phat) + z * z / (4 * n)) / n)) / (1 + z * z / n);
}
```

Vậy là bước một đã xong, tiếp theo, mình chuẩn bị thêm một ít dataset example để test thử:

```js
const data = [{"up":15,"down":0},{"up":70,"down":2},{"up":14,"down":2},{"up":4,"down":2},{"up":2,"down":15},{"up":5,"down":2},{"up":8,"down":6},{"up":37,"down":5},{"up":21,"down":23},{"up":52,"down":8},{"up":28,"down":12},{"up":147,"down":2},{"up":61,"down":1},{"up":30,"down":1},{"up":23,"down":5},{"up":40,"down":1},{"up":37,"down":2},{"up":61,"down":6},{"up":54,"down":2},{"up":18,"down":0},{"up":12,"down":2},{"up":68,"down":2}]
```

Và tiếp theo dĩ nhiên là mình sẽ thử nghiệm với data này:

```js
const result = data
  .map((record) => ({
    ...record,
    wrong_1: record.up - record.down,
    wrong_2: Number((record.up / (record.up +  record.down)).toFixed(5)),
    score: Number(ci_lower_bound(record.up, record.up + record.down).toFixed(5))
  }))
  .sort((a, b) => b.score > a.score);

console.table(result)
```

Cuối cùng mình cần chạy thử, và để hoàn thành việc thử nghiệm nhanh chóng nhất, mình đã chạy trực tiếp bằng console trên browser cho lẹ, và browser mặc định của mình là Firefox:

![Console result of Firefox](/assets/blog/today-i-fkup-with-js/firefox-console.png)

Tới đây, sau khi nhìn kết quả mình đã tấm tắc khen hay.

Nhưng...

Cho tới khi mình thử lại với cùng đoạn code trên ở trên NodeJS thì...

![Console result of Node](/assets/blog/today-i-fkup-with-js/node-console.png)

"*Quát đờ heo*", đó là những gì mình đã thốt lên sau khi nhìn những gì console nó in ra. Hai kết quả vẫn trả về đúng, tuy nhiên, thứ tự lại khác nhau rất nhiều.

Mình còn sợ mình copy thiếu hoặc làm sai bước nào, thế là mình phải ngồi khoảng 30p để tìm đủ cách xem thử 2 đoạn code có khác nhau chỗ nào không. Và tất nhiên là không rồi :nosebleed:

Sau một hồi nhìn tới nhìn lui, mình nghĩ kết quả cho từng pair data vẫn đúng, nhưng thứ tự sai, thì tức là chỉ có thể phép sort có vấn đề.

## Sorting in JS

Sau một hồi vật lộn với debugging thì mình đã tìm ra chỗ gây lỗi, đó là chỗ `b.score > a.score`, cách fix tương đối đơn giản, mình sửa dấu *greater than* `>` thành *minus* `-` là xong:

```diff
-  .sort((a, b) => b.score > a.score);
+  .sort((a, b) => b.score - a.score);
```

Tại sao ư? Lý do là đây:

![](/assets/blog/today-i-fkup-with-js/lsp.png)

Theo **Properties of the Array Prototype Object** trong **ECMAScript specification**[^0] mình tìm được:

> This method sorts the elements of this array. The sort must be stable (that is, elements that compare equal must remain in their original order). If `comparefn` is not **undefined**, it should be a function that accepts two arguments `x` and `y` and returns a *negative Number* if `x` < `y`, a *positive Number* if `x` > `y`, or a *zero* otherwise.

[^0]: https://tc39.es/ecma262/multipage/indexed-collections.html#sec-array.prototype.sort

Tại sao nhỉ? Lúc mình debug, mình phát hiện ra một thứ nho nhỏ khá thú vị:

![](/assets/blog/today-i-fkup-with-js/compare-console.png)

Hai argument ở hai engine này có thứ tự khác nhau, lý do tại sao thì mình cũng chả biết, nhưng để đoán thì có thể là do mỗi browser đều có một spec riêng, mặc dù cuối cùng vẫn sẽ follow theo một standard cuối cùng. Và có thể nó được implement từ phía engine của browser, là depend của một số chỗ khác nên rất khó để thay đổi thành một kiểu thống nhất.

Phán đoán trên dựa vào việc khi mình lướt qua spec:
> If comparefn is not undefined, it should be a function that **accepts two arguments x and y** (...)

Đúng vậy, nó chỉ nhắc tới việc hai agrument `x` và `y` chứ không hề nói về thứ tự.

Vậy mà linter nó không báo lỗi kỳ ghê, đúng là "expect" chứ không phải "must".

Maybe you don't know:
- Engine JS của Firefox là SpiderMonkey, khác với đa số các runtime khác như Chromium, NodeJS là V8.
- Hàm sort mặc định của Firefox sử dụng Merge Sort[^1]
- Hàm sort mặc định của V8 là Tim Sort[^2]

[^1]: https://github.com/v8/v8/blob/00e0311b24f81702be8952994afd5ce8a9b415b8/third_party/v8/builtins/array-sort.tq#L5
[^2]: https://bugzilla.mozilla.org/attachment.cgi?id=150540&action=edit

## Kết

Mặc dù biết JavaScript sucks nhưng mình không ngờ lâu lâu vẫn vấp phải mấy cái lỗi củ chuối như này :go: Thôi dù sao nó cũng đang nuôi mình nên chửi thì chửi chứ vẫn nhắm mắt cho qua thôi. Nếu bạn còn đọc tới đây, cảm ơn bạn đã dành thời gian ra ngồi đọc cái bài blog ~~chửi rủa~~ bug write up này của mình.
