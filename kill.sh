if ps -p $(cat /home/discord/run.pid) > /dev/null
then
    kill -9 $(cat /home/discord/run.pid)
fi