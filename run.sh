ps -ef | grep discordkarma | grep -v grep | awk '{print $2}' | xargs kill
git fetch --all
git reset --hard origin/master
chmod 777 run.sh
yarn build
nohup node /home/discord/discordkarma/build/src/index.js > /home/discord/discordkarma/logs.log 2>&1 &
