echo $1
# sudo ps -ef | sudo grep karma | sudo grep -v grep | sudo awk '{print $2}' | sudo xargs kill
nohup DISCORD_API_KEY=$2 BOT_OWNER_ID=$3 DATABASE_HOST=$4 DATABASE_USER=$5 DATABASE_PASSWORD=$6 DATABASE_NAME=$7 DATABASE_PORT=$8 node $1/build/src/index.js > /home/discord/logs.log 2>&1 &
exit