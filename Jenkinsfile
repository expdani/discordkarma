pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "node -v"
                sh "npm install"
                sh "yarn"
                sh "npm run build"
                sh "sudo chmod +x -R ${WORKSPACE}"
            }
        }
        stage("Deploy") {
            steps {
                sh "export DISCORD_API_KEY=${DISCORD_API_KEY}"
                sh "export BOT_OWNER_ID=${BOT_OWNER_ID}"
                sh "export DATABASE_HOST=${DATABASE_HOST}"
                sh "export DATABASE_USER=${DATABASE_USER}"
                sh "export DATABASE_PASSWORD=${DATABASE_PASSWORD}"
                sh "export DATABASE_NAME=${DATABASE_NAME}"
                sh "export DATABASE_PORT=${DATABASE_PORT}"
                sh "nohup node ${WORKSPACE}/build/src/index.js > /home/discord/logs.log 2>&1 &"
            }
        }
    }
}