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
                script {
                    withEnv(['JENKINS_NODE_COOKIE=dontkill']) {
                        sh "sudo sh ${WORKSPACE}/run.sh ${WORKSPACE}"
                    }
                }
            }
        }
    }
}