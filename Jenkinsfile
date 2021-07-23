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
                sh 'set DISCORD_API_KEY="${DISCORD_API_KEY}"'
                sh 'set BOT_OWNER_ID="${BOT_OWNER_ID}"'
                sh 'set DATABASE_HOST="${DATABASE_HOST}"'
                sh 'set DATABASE_USER="${DATABASE_USER}"'
                sh 'set DATABASE_PASSWORD="${DATABASE_PASSWORD}"'
                sh 'set DATABASE_NAME="${DATABASE_NAME}"'
                sh 'set DATABASE_PORT="${DATABASE_PORT}"'
                sh "nohup node ${WORKSPACE}/build/src/index.js > /home/discord/logs.log 2>&1 &"
            }
        }
    }
}