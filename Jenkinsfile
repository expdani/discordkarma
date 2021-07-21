pipeline {
     agent any
     stages {
        stage("Build") {
            steps {
                sh "node -v"
                sh "npm install"
                sh "yarn"
                sh "npm run build"
            }
        }
        stage("Deploy") {
            steps {
                // sh "screen -X -S 'discord-karma' quit"
                sh "screen -d -m -S 'discord-karma' node ${WORKSPACE}/build/src/index.js"
            }
        }
    }
}