#!/bin/sh
set -e
if [ "$#" -ne "9" ]; then
    echo "Error, incorrect syntax!"
    echo "Usage: $0 PROJECT_NAME PROJECT_VERSION REPORT_NAME APP_NAPE APP_VERSION APP_PLATFORM ENVIRONMENT \"PATH_TO_REPORT\" \"URL_OF_DASHBOARD\" "
    exho "Example: $0 IMP 1.0 AndroidFullTestPhone IMPA 1.0 Android \"./report.json\" \"http://localhost:8080\" "
    exit 1
fi
PROJECT="$1"
PROJECT_VERSION="$2"
ELEMENT="$3"
APP_NAME="$4"
APP_VERSION="$5"
APP_PLATFORM="$6"
ENVIRONMENT="$7"
REPORT_PATH="$8"
BASE_URL="$9"
echo "==== Building report $file... ===="
file="requestBody.json"
echo > $file
echo '{ "project": "' >> $file
echo "$PROJECT" >> $file
echo '", "projectVersion": "' >> $file
echo "$PROJECT_VERSION" >> $file
echo '", "element": "' >> $file
echo "$ELEMENT" >> $file
echo '", "date": "' >> $file
echo `date -u +"%FT%T.000Z"` >> $file
echo '", "appName": "' >> $file
echo "$APP_NAME" >> $file
echo '", "appVersion": "' >> $file
echo "$APP_VERSION" >> $file
echo '", "appPlatform": "' >> $file
echo "$APP_PLATFORM" >> $file
echo '", "environment": "' >> $file
echo "$ENVIRONMENT" >> $file
echo '", "cucumberFeatures": ' >> $file
cat "$REPORT_PATH" >> $file
echo "}" >> $file
echo "==== Pushing report $file... ===="
curl -v -H "Accept: application/json" -H "Content-Type: application/json" -X POST --header "Content-Type: application/json" --data @${file} "$9"/api/import
echo -e "\n==== Publication done ====\n"

# #!/bin/sh
# # example:
# #
# #  pushReport IMP "1.0" AndroidFullTestPhone IMPA "1.0" Android "./report.json" "http://localhost:8080"
# pushReport() {
#   if [ $# -ne 9 ]; then
#      echo "Incorrect syntax. Please use the following:"
#      echo "   - pushReport PROJECT_NAME PROJECT_VERSION REPORT_NAME APP_NAPE APP_VERSION APP_PLATFORM ENVIRONMENT \"PATH_TO_REPORT\" \"URL_OF_DASHBOARD\""
#      return 1
#   fi
# #  $1:PROJECT $2:PROJECT_VERSION $3:ELEMENT $4:APP_NAME $5:APP_VERSION $6:APP_PLATFORM $7:ENVIRONMENT $8:REPORT_PATH $9:BASE_URL
#   echo "Publish report to dashboard on $9"
#   echo > requestBody.json
#   echo '{ "project": "' >> requestBody.json
#   echo "$1" >> requestBody.json
#   echo '", "projectVersion": "' >> requestBody.json
#   echo "$2" >> requestBody.json
#   echo '", "element": "' >> requestBody.json
#   echo "$3" >> requestBody.json
#   echo '", "date": "' >> requestBody.json
#   echo `date -u +"%FT%T.000Z"` >> requestBody.json
#   echo '", "appName": "' >> requestBody.json
#   echo "$4" >> requestBody.json
#   echo '", "appVersion": "' >> requestBody.json
#   echo "$5" >> requestBody.json
#   echo '", "appPlatform": "' >> requestBody.json
#   echo "$6" >> requestBody.json
#   echo '", "environment": "' >> requestBody.json
#   echo "$7" >> requestBody.json
#   echo '", "cucumberFeatures": ' >> requestBody.json
#   cat "$8" >> requestBody.json
#   echo "}" >> requestBody.json
#   curl -s -H "Accept: application/json" -H "Content-Type: application/json" -X POST --header "Content-Type: application/json" --data @requestBody.json "$9"/api/import
#   echo "Publication done"
# }