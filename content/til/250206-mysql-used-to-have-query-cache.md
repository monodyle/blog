---
title: MySQL used to have Query Cache
date: Feb 06, 2025
tags: [database, mysql]
---

According to the article [MySQL 8.0: Retiring Support for the Query Cache](https://dev.mysql.com/blog-archive/mysql-8-0-retiring-support-for-the-query-cache/), MySQL used to have Query Cache.

When the SQL have the same query, it should hit the cache. This is the good design to improve the performance. But later, the query cache has been disabled-by-default since MySQL 5.6 (2013).

As it is known to not scale with high-throughput workloads on multi-core machines. The original design of query cache was build on single-thread, so when the query cache was enable on the multi-core machines, it got serious slower and easily become a server bottleneck.

And its removed in MySQL 8.0 (2018)

Thanks @github.com/xluffy for sharing this
