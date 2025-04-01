---
title: Go — CORS by API Key
excerpt: Middleware for checking CORS with API Key
date: Apr 01, 2025
tags: [go, snippet]
---

```go
package main

import (
	"net/http"

	"github.com/gin-gonic/gin"
)

func CORSMiddleware(allowedOriginsByKey map[string][]string) gin.HandlerFunc {
	return func(c *gin.Context) {
		origin := c.Request.Header.Get("Origin")
		apiKey := c.Request.Header.Get("X-API-KEY")

		allowedOrigins, keyExists := allowedOriginsByKey[apiKey]
		isOriginAllowed := false

		if keyExists {
			if len(allowedOrigins) == 0 {
				isOriginAllowed = true
			} else {
				for _, allowed := range allowedOrigins {
					if allowed == origin || allowed == "*" {
						isOriginAllowed = true
						break
					}
				}
			}
		} else {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Invalid API key",
			})
			c.Abort()
			return
		}

		if isOriginAllowed {
			c.Writer.Header().Set("Access-Control-Allow-Origin", origin)
			c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
			c.Writer.Header().Set("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE, OPTIONS")
		}

		if c.Request.Method == http.MethodOptions {
			if isOriginAllowed {
				c.AbortWithStatus(http.StatusOK)
			} else {
				c.AbortWithStatus(http.StatusUnauthorized)
			}
			return
		}

		if !isOriginAllowed {
			c.JSON(http.StatusUnauthorized, gin.H{
				"error": "Origin not allowed",
			})
			c.Abort()
			return
		}

		c.Next()
	}
}

func main() {
	router := gin.Default()

	allowedOriginsByKey := map[string][]string{
		"B8DA3426EAF78963F5144BC81AEE782A4101FB90B6CF4E5926EC034E05407B16": {"http://localhost:3000", "https://api.example.com"},
		"0F1F84B8368EE22196050F39F795E96AD8C976DB0536B13EEB573147449B80A7": {"http://localhost:4000"},
	}

	router.Use(middleware.CORSMiddleware(allowedOriginsByKey))

	router.GET("/api/data", func(c *gin.Context) {
		c.JSON(http.StatusOK, gin.H{"message": "Success"})
	})

	router.Run(":8000")
}
```
