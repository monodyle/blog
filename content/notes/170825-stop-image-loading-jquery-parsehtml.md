---
title: Stop auto load imges when parseHTML in jQuery
date: Aug 25, 2017
tags: [jquery]
---

Source: http://stackoverflow.com/a/15217348

```js
$.get(URL).done(function (responseText) {
  responseText = responseText.replace(/<img [^>]*src=['"]([^'"]+)[^>]*>/gi, function (match, capture) {
    return '<img data-src="' + capture + '" />';
  });
  console.log($(responseText).find('img'));
});
```
