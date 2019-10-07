#!/bin/bash
# */1 * * * * /espdemo/projects/imageclassification/bin/syn.sh
set -x
timestamp=$( date +%T )
app_home=/espdemo/projects/imageclassification
model_source_file=/home/yching/dl_weights/GartnerCombined_v2/resnet50.astore
model_target_file=/espdemo/projects/imageclassification/models/resnet50_caffe_Gartner/resnet50_caffe.astore

echo $app_home
SOURCE="${BASH_SOURCE[0]}"
while [ -h "$SOURCE" ] ; do SOURCE="$(readlink "$SOURCE")"; done
DIR="$( cd -P "$( dirname "$SOURCE" )" && pwd )"

if [ "$model_source_file" -nt "$model_target_file" ]
then
    printf '%s\n' "$model_source_file is newer than $model_target_file"
    echo printf '%s\n' "Project model is older than source model"
    mv $model_target_file ${model_target_file}_${timestamp}
    cp -puv $model_source_file $model_target_file
    nohup $app_home/bin/stop.sh > $app_home/logs/stop.log 2>&1 &
    sleep 5
    nohup $app_home/bin/start.sh > $app_home/logs/start.log 2>&1 &
else
    echo printf '%s\n' "Project model is newer than source model"
fi
