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
                sh "./killNohup.sh"
                sh "JENKINS_NODE_COOKIE=dontKillMe nohup node ${WORKSPACE}/build/src/index.js > ${WORKSPACE}/logs.log 2>&1 &"
            }
        }
    }
}