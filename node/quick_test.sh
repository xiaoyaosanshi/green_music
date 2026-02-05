#!/bin/bash

# 快速测试脚本 - 管理后台接口
# 使用方法: bash quick_test.sh

BASE_URL="http://localhost:3001"
ADMIN_USERNAME="admin"
ADMIN_PASSWORD="Admin123456"

echo "========================================"
echo "Green Music 管理后台接口快速测试"
echo "========================================"
echo ""

# 检查服务
echo "检查后端服务..."
HEALTH=$(curl -s -o /dev/null -w "%{http_code}" ${BASE_URL}/health 2>/dev/null)
if [ "$HEALTH" != "200" ]; then
  echo "❌ 后端服务未运行，请先启动: cd node && npm start"
  exit 1
fi
echo "✅ 服务运行正常"
echo ""

# 登录
echo "1. 管理员登录..."
RESPONSE=$(curl -s -X POST ${BASE_URL}/api/admin/auth/login \
  -H "Content-Type: application/json" \
  -d "{\"username\":\"${ADMIN_USERNAME}\",\"password\":\"${ADMIN_PASSWORD}\"}")

TOKEN=$(echo $RESPONSE | grep -o '"token":"[^"]*' | cut -d'"' -f4)

if [ -z "$TOKEN" ]; then
  echo "❌ 登录失败"
  echo "响应: $RESPONSE"
  exit 1
fi

echo "✅ 登录成功"
echo "Token: ${TOKEN:0:50}..."
echo ""

# 测试接口
echo "2. 获取数据统计..."
curl -s -H "Authorization: Bearer $TOKEN" \
  ${BASE_URL}/api/admin/statistics | python -m json.tool 2>/dev/null || \
curl -s -H "Authorization: Bearer $TOKEN" \
  ${BASE_URL}/api/admin/statistics
echo ""
echo ""

echo "3. 获取音乐列表（前3条）..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/admin/songs?page=1&pageSize=3" | python -m json.tool 2>/dev/null || \
curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/admin/songs?page=1&pageSize=3"
echo ""
echo ""

echo "4. 获取用户列表（前3条）..."
curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/admin/users?page=1&pageSize=3" | python -m json.tool 2>/dev/null || \
curl -s -H "Authorization: Bearer $TOKEN" \
  "${BASE_URL}/api/admin/users?page=1&pageSize=3"
echo ""
echo ""

echo "========================================"
echo "✅ 快速测试完成！"
echo "========================================"
echo ""
echo "提示: 查看完整测试命令请参考: 管理后台接口curl测试命令.md"

