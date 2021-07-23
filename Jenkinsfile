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
            script{
                withEnv(['JENKINS_NODE_COOKIE=dontkill']) {
                    sh "nohup node ${WORKSPACE}/build/src/index.js > ${WORKSPACE}/build/src/logs.log 2>&1 &"
                }
            }
        }
    }
}