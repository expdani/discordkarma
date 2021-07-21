ps -ef | grep karma | grep -v grep | awk '{print $2}' | xargs kill
git fetch --all
git reset --hard origin/master
chmod 777 run.sh
yarn
yarn build
nohup node /home/discord/karma/build/src/index.js > /home/discord/karma/logs.log 2>&1 &
