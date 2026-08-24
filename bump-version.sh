#!/bin/bash
#
# 更新 main.css / main.js 引用上的版本号，强制浏览器重新拉取。
#
# 为什么需要：GitLink Pages 只发 Cache-Control: public，不带 max-age，
# 浏览器按自己的启发式规则缓存。改完样式直接推送的话，回访的人可能拿到
# 「新 HTML + 旧 CSS」，页面会以比原样更难看的方式错位。
# 带上 ?v=<日期> 后浏览器视作新地址，必定重新下载。
#
# 用法：
#   ./bump-version.sh              # 用今天的日期
#   ./bump-version.sh 20260901     # 指定版本号
#
# 什么时候跑：改过 assets/css/main.css 或 assets/js/main.js 之后、提交之前。
# 只改 HTML 内容不用跑。

set -euo pipefail
cd "$(dirname "$0")"

VER="${1:-$(date +%Y%m%d)}"
OLD=$(grep -ho 'main\.css?v=[0-9a-zA-Z]*' index.html | head -1 | sed 's/.*v=//')

if [ "$OLD" = "$VER" ]; then
  echo "版本号已经是 $VER，未改动。"
  echo "同一天内多次改样式，可加后缀区分：./bump-version.sh ${VER}b"
  exit 0
fi

for f in *.html; do
  perl -pi -e "s{(main\.(?:css|js))\?v=[^\"]*}{\$1?v=$VER}g" "$f"
done

echo "版本号 $OLD → $VER"
grep -h 'main\.css?\|main\.js?' *.html | sort -u | sed 's/^/  /'
echo
echo "共更新 $(ls *.html | wc -l | tr -d ' ') 个页面，记得连同样式改动一起提交。"
