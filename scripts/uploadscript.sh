#!/bin/sh
# example:
#
#  pushReport IMP "1.0" AndroidFullTestPhone IMPA "1.0" Android "./report.json" "http://localhost:8080"
pushReport() {
  if [ $# -ne 9 ]; then
     echo "Incorrect syntax. Please use the following:"
     echo "   - pushReport PROJECT_NAME PROJECT_VERSION REPORT_NAME APP_NAPE APP_VERSION APP_PLATFORM ENVIRONMENT \"PATH_TO_REPORT\" \"URL_OF_DASHBOARD\""
     return 1
  fi
#  $1:PROJECT $2:PROJECT_VERSION $3:ELEMENT $4:APP_NAME $5:APP_VERSION $6:APP_PLATFORM $7:ENVIRONMENT $8:REPORT_PATH $9:BASE_URL
  echo "Publish report to dashboard on $9"
  echo > requestBody.json
  echo '{ "project": "' >> requestBody.json
  echo "$1" >> requestBody.json
  echo '", "projectVersion": "' >> requestBody.json
  echo "$2" >> requestBody.json
  echo '", "element": "' >> requestBody.json
  echo "$3" >> requestBody.json
  echo '", "date": "' >> requestBody.json
  echo `date -u +"%FT%T.000Z"` >> requestBody.json
  echo '", "appName": "' >> requestBody.json
  echo "$4" >> requestBody.json
  echo '", "appVersion": "' >> requestBody.json
  echo "$5" >> requestBody.json
  echo '", "appPlatform": "' >> requestBody.json
  echo "$6" >> requestBody.json
  echo '", "environment": "' >> requestBody.json
  echo "$7" >> requestBody.json
  echo '", "cucumberFeatures": ' >> requestBody.json
  cat "$8" >> requestBody.json
  echo "}" >> requestBody.json
  curl -s -H "Accept: application/json" -H "Content-Type: application/json" -X POST --header "Content-Type: application/json" --data @requestBody.json "$9"/api/import
  echo "Publication done"
}