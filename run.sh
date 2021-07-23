echo $1
sudo ps -ef | sudo grep karma | sudo grep -v grep | sudo awk '{print $2}' | sudo xargs kill
sudo nohup node $1/build/src/index.js > /home/discord/logs.log 2>&1 &