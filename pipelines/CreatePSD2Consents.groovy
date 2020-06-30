#!groovy
@Library('CIPaaS')
import com.bnpparibasfortis.CIPaaServices
node ('Customers_slave'){
    stage ('Start pipeline') {
        println "Start pipeline"
    }

    stage ('Remove workspace') {
        cleanWs()
    }

    stage ('Checkout') {
         checkout([$class: 'GitSCM', branches: [[name: '*/Customers/Aymeric']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'customers-apiautomation']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'GIT_JENKINS_USER', url: 'https://gitlab.res.sys.shared.fortis/ocpl/api_testing/api-testing.git']]])
    }

    dir('customers-apiautomation') {
        stage ('Create multiple psd2 consents') {
            steps.sh 'npm install'
            if (brandParam == 'Fintro') {
                steps.sh 'npm start features/create_psd2_consent.feature:17'
            }else{
                steps.sh 'npm start features/create_psd2_consent.feature:13'
            }
        }
    }

    stage ('End pipeline') {
        println "End pipeline"
    }
}

