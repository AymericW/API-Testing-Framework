#!groovy
@Library('CIPaaS')
import com.bnpparibasfortis.CIPaaServices
node ('Customers_slave'){
    stage ('Start pipeline') {
        println "Start pipeline"
    }


     stage ('Checkout') {
         checkout([$class: 'GitSCM', branches: [[name: '*/Customers']], doGenerateSubmoduleConfigurations: false, extensions: [[$class: 'RelativeTargetDirectory', relativeTargetDir: 'customers-uiautomation']], submoduleCfg: [], userRemoteConfigs: [[credentialsId: 'GIT_JENKINS_USER', url: 'https://gitlab.res.sys.shared.fortis/ocpl/api_testing/api-testing.git']]])
         
     }

        stage ('Install NPM local dependencies') {
            steps.sh "npm config set registry ${centralNPMPublicGroupURL}"
            steps.sh "npm install"
        }
        stage ('Run the script(ocpl_prospect.feature)') {
            steps.sh "sh ./scripts/run.sh 'ocpl_prospect'"
        }
        stage ('Upload the Report') {
            steps.sh 'sh ./scripts/uploadscript.sh "CUSTOMERS" "Current_Release" "Prospect API" "API" "Full Test" "API" "QA+1" "ocpl_prospect.json" "http://wpdm0006.be.fortis.bank:8080/"'
        }

    stage ('End pipeline') {
        println "End pipeline"
    }
}
