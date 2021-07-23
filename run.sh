kill -9 $(pgrep -f discord-karma)

export DISCORD_API_KEY=$2
export BOT_OWNER_ID=$3
export DATABASE_HOST=$4
export DATABASE_USER=$5
export DATABASE_PASSWORD=$6
export DATABASE_NAME=$7
export DATABASE_PORT=$8

nohup node $1/build/src/index.js > /home/discord/logs.log 2>&1 &
exit