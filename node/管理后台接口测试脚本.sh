#!/bin/bash

# Green Music 管理后台 API 接口测试脚本
# 使用方法: bash 管理后台接口测试脚本.sh

BASE_URL="http://localhost:3001"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin123456"
TOKEN=""

# 颜色输出
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "Green Music 管理后台 API 接口测试"
echo "========================================"
echo ""

# 检查服务是否运行
echo -e "${BLUE}检查后端服务是否运行...${NC}"
HEALTH_CHECK=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/health 2>/dev/null)

if [ "$HEALTH_CHECK" != "200" ]; then
  echo -e "${RED}❌ 后端服务未运行或无法连接${NC}"
  echo -e "${YELLOW}请先启动后端服务:${NC}"
  echo "  cd node"
  echo "  npm start"
  echo ""
  exit 1
fi

echo -e "${GREEN}✅ 后端服务运行正常${NC}"
echo ""

# 1. 管理员登录
echo -e "${YELLOW}1. 管理员登录获取 Token...${NC}"
LOGIN_RESPONSE=$(curl -s -X POST ${BASE_URL}/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${ADMIN_USERNAME}\",\"password\":\"${ADMIN_PASSWORD}\"}")

TOKEN=$(echo $LOGIN_RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo -e "${RED}❌ 登录失败${NC}"
  echo "响应: $LOGIN_RESPONSE"
  echo ""
  echo -e "${YELLOW}提示:${NC}"
  echo "- 请确保数据库中有管理员账号"
  echo "- 默认管理员账号: admin / Admin123456"
  echo "- 或执行: node migrations/init_mock_users.js 初始化管理员"
  exit 1
fi

echo -e "${GREEN}✅ Token 获取成功: ${TOKEN:0:50}...${NC}"
echo ""

# 2. 获取管理员信息
echo -e "${YELLOW}2. 获取管理员信息...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/auth/info | python -m json.tool 2>/dev/null || curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/auth/info
echo ""
echo ""

# 3. 获取数据统计概览
echo -e "${YELLOW}3. 获取数据统计概览...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/statistics | python -m json.tool 2>/dev/null || curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/statistics
echo ""
echo ""

# 4. 获取音乐列表
echo -e "${YELLOW}4. 获取音乐列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/songs?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/songs?page=1&pageSize=5" | head -15
echo ""
echo ""

# 5. 获取音乐详情
echo -e "${YELLOW}5. 获取音乐详情（ID=1）...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/songs/1 | python -m json.tool 2>/dev/null | head -25 || curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/songs/1 | head -12
echo ""
echo ""

# 6. 上架/下架音乐
echo -e "${YELLOW}6. 上架/下架音乐（ID=1）...${NC}"
curl -s -X PUT ${BASE_URL}/api/admin/songs/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":1}' | python -m json.tool 2>/dev/null || curl -s -X PUT ${BASE_URL}/api/admin/songs/1/status \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"status":1}'
echo ""
echo ""

# 7. 获取专辑列表
echo -e "${YELLOW}7. 获取专辑列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/albums?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -25 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/albums?page=1&pageSize=5" | head -12
echo ""
echo ""

# 8. 获取歌词列表
echo -e "${YELLOW}8. 获取歌词列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/lyrics?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -25 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/lyrics?page=1&pageSize=5" | head -12
echo ""
echo ""

# 9. 获取用户列表
echo -e "${YELLOW}9. 获取用户列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/users?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/users?page=1&pageSize=5" | head -15
echo ""
echo ""

# 10. 获取用户详情
echo -e "${YELLOW}10. 获取用户详情（ID=1）...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/users/1 | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" ${BASE_URL}/api/admin/users/1 | head -15
echo ""
echo ""

# 11. 获取评论列表
echo -e "${YELLOW}11. 获取评论列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/comments?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/comments?page=1&pageSize=5" | head -15
echo ""
echo ""

# 12. 获取歌单列表
echo -e "${YELLOW}12. 获取歌单列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/playlists?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/playlists?page=1&pageSize=5" | head -15
echo ""
echo ""

# 13. 获取用户统计
echo -e "${YELLOW}13. 获取用户统计...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/users" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/users" | head -15
echo ""
echo ""

# 14. 获取音乐统计
echo -e "${YELLOW}14. 获取音乐统计...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/songs" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/songs" | head -15
echo ""
echo ""

# 15. 获取播放统计
echo -e "${YELLOW}15. 获取播放统计...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/playback" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/statistics/playback" | head -15
echo ""
echo ""

# 16. 获取操作日志列表
echo -e "${YELLOW}16. 获取操作日志列表...${NC}"
curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/logs?page=1&pageSize=5" | python -m json.tool 2>/dev/null | head -30 || curl -s -H "Authorization: Bearer $TOKEN" "${BASE_URL}/api/admin/logs?page=1&pageSize=5" | head -15
echo ""
echo ""

echo "========================================"
echo -e "${GREEN}✅ 所有接口测试完成！${NC}"
echo "========================================"
echo ""
echo "提示："
echo "- 如果某些接口返回错误，可能是数据库中没有对应数据"
echo "- 文件上传接口需要实际文件，未在此脚本中测试"
echo "- 创建/更新/删除操作需要谨慎，建议在测试环境执行"

