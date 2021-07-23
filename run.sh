echo $1
# sudo ps -ef | sudo grep karma | sudo grep -v grep | sudo awk '{print $2}' | sudo xargs kill
set DISCORD_API_KEY=$2
set BOT_OWNER_ID=$3
set DATABASE_HOST=$4
set DATABASE_USER=$5
set DATABASE_PASSWORD=$6
set DATABASE_NAME=$7
set DATABASE_PORT=$8

nohup node $1/build/src/index.js > /home/discord/logs.log 2>&1 &
exit