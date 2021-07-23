echo $7
# sudo ps -ef | sudo grep karma | sudo grep -v grep | sudo awk '{print $2}' | sudo xargs kill
set DISCORD_API_KEY=$1
set BOT_OWNER_ID=$2
set DATABASE_HOST=$3
set DATABASE_USER=$4
set DATABASE_PASSWORD=$5
set DATABASE_NAME=$6
set DATABASE_PORT=$7

nohup node $1/build/src/index.js > /home/discord/logs.log 2>&1 &
exit