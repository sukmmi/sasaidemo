#!/bin/bash

SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ] ; do SOURCE="$(readlink "$SOURCE")"; done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

#esp logging - parent directory of /log
cd ${DIR}/.. && pwd

export LD_LIBRARY_PATH=$LD_LIBRARY_PATH:$DFESP_HOME/lib:/opt/sas/viya/home/SASFoundation/sasexe:$DFESP_HOME/ssl/lib
export PATH=$PATH:$DFESP_HOME/bin
export DFESP_SSLPATH=$DFESP_HOME/ssl/lib
export DFESP_JAVA_TRUSTSTORE=/opt/sas/viya/config/etc/SASSecurityCertificateFramework/cacerts/trustedcerts.jks
export SSLCALISTLOC=/opt/sas/viya/config/etc/SASSecurityCertificateFramework/cacerts/trustedcerts.pem


nohup $DFESP_HOME/bin/dfesp_xml_server -http 5558 -pubsub 5557 -model file://project.xml -logconfig etc/my-esp-logger.xml > ${DIR}/../logs/esp_consol.log 2>&1 &

if [ $? -eq 0 ]
then
 echo "Successfully start ESP server. Log in ${DIR}/../logs/esp_consol.log"
else
 echo "Failed to start ESP. Check ${DIR}/../logs/esp_consol.log"
fi
