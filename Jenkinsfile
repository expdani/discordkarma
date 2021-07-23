pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "node -v"
                sh "if ps -p \$(cat /home/discord/run.pid) > /dev/null
                    then
                        kill -9 \$(cat /home/discord/run.pid)
                    fi"
                sh "npm install"
                sh "yarn"
                sh "npm run build"
                sh "sudo chmod +x -R ${WORKSPACE}"
            }
        }
        stage("Deploy") {
            steps {
                sh "sudo sh ${WORKSPACE}/run.sh \"${WORKSPACE}\" \"${DISCORD_API_KEY}\" \"${BOT_OWNER_ID}\" \"${DATABASE_HOST}\" \"${DATABASE_USER}\" \"${DATABASE_PASSWORD}\" \"${DATABASE_NAME}\" \"${DATABASE_PORT}\""
            }
        }
    }
}