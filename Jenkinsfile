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
                sh "sudo ps -ef | sudo grep karma | sudo grep -v grep | sudo awk '{print \$5}' | sudo xargs kill"
                sh "nohup node ${WORKSPACE}/build/src/index.js > ${WORKSPACE}/logs.log 2>&1 &"
            }
        }
    }
}