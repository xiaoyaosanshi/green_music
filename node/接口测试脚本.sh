#!/bin/bash

# Green Music API 接口测试脚本
# 使用方法: bash 接口测试脚本.sh

BASE_URL="http://localhost:3001"
TOKEN=""

echo "========================================"
echo "Green Music API 接口测试"
echo "========================================"
echo ""

# 1. 获取 Token
echo "1. 用户登录获取 Token..."
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"identity":"testuser1","password":"Test123456"}')

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败"
  exit 1
fi

echo "✅ Token 获取成功: ${TOKEN:0:50}..."
echo ""

# 2. 健康检查
echo "2. 健康检查..."
curl -s ${BASE_URL}/health | python -m json.tool 2>/dev/null || curl -s ${BASE_URL}/health
echo ""
echo ""

# 3. 获取当前用户信息
echo "3. 获取当前用户信息..."
curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/me | python -m json.tool 2>/dev/null | head -10 || curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/me | head -5
echo ""
echo ""

# 4. 获取歌曲列表
echo "4. 获取歌曲列表..."
curl -s "${BASE_URL}/api/songs?page=1&pageSize=2" | python -m json.tool 2>/dev/null | head -15 || curl -s "${BASE_URL}/api/songs?page=1&pageSize=2" | head -8
echo ""
echo ""

# 5. 获取歌曲详情
echo "5. 获取歌曲详情..."
curl -s ${BASE_URL}/api/songs/1 | python -m json.tool 2>/dev/null | head -20 || curl -s ${BASE_URL}/api/songs/1 | head -10
echo ""
echo ""

# 6. 获取歌词
echo "6. 获取歌词..."
curl -s "${BASE_URL}/api/songs/1/lyrics" | python -m json.tool 2>/dev/null | head -10 || curl -s "${BASE_URL}/api/songs/1/lyrics" | head -5
echo ""
echo ""

# 7. 获取播放历史
echo "7. 获取播放历史..."
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/me/play-history?page=1&pageSize=2" | python -m json.tool 2>/dev/null | head -15 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/me/play-history?page=1&pageSize=2" | head -8
echo ""
echo ""

# 8. 获取歌单列表
echo "8. 获取歌单列表..."
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/playlists?page=1&pageSize=2" | python -m json.tool 2>/dev/null | head -15 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/playlists?page=1&pageSize=2" | head -8
echo ""
echo ""

# 9. 获取评论列表
echo "9. 获取评论列表..."
curl -s "${BASE_URL}/api/comments?songId=1&page=1&pageSize=2" | python -m json.tool 2>/dev/null | head -15 || curl -s "${BASE_URL}/api/comments?songId=1&page=1&pageSize=2" | head -8
echo ""
echo ""

# 10. 获取通知列表
echo "10. 获取通知列表..."
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/notifications?page=1&pageSize=2" | python -m json.tool 2>/dev/null | head -15 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/notifications?page=1&pageSize=2" | head -8
echo ""
echo ""

# 11. 获取个性化推荐
echo "11. 获取个性化推荐..."
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/recommend/personal?type=song&limit=3" | python -m json.tool 2>/dev/null | head -20 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/recommend/personal?type=song&limit=3" | head -10
echo ""
echo ""

# 12. 获取热门推荐
echo "12. 获取热门推荐..."
curl -s "${BASE_URL}/api/recommend/hot?type=song&limit=3" | python -m json.tool 2>/dev/null | head -15 || curl -s "${BASE_URL}/api/recommend/hot?type=song&limit=3" | head -8
echo ""
echo ""

echo "========================================"
echo "✅ 所有接口测试完成！"
echo "========================================"

