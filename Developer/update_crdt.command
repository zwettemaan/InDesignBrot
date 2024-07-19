if [ `uname` != "Darwin" ]; then
    echo Needs to run on Mac
    exit
fi

export TARGET_NAME=InDesignBrot

export SCRIPT_DIR=`dirname $0`
cd $SCRIPT_DIR
export SCRIPT_DIR=`pwd`/

cd ..
export PROJECT_DIR=`pwd`/

. "${TIGHTENER_GIT_ROOT}BuildScripts/setEnv"

echo "update_crdt started"

if [ "${TIGHTENER_GIT_ROOT}" = "" -o ! -d "${TIGHTENER_GIT_ROOT}" ]; then
    echo "Cannot update nzip file. ${TARGET_NAME} repo needs to be installed alongside Tightener repo"
    exit
fi

export CREATIVE_DEVELOPER_TOOLS_UXP="${TIGHTENER_GIT_ROOT}/../CRDT_UXP/CreativeDeveloperTools_UXP"
if [ ! -d "${CREATIVE_DEVELOPER_TOOLS_UXP}" ]; then
    echo "Cannot update CRDT file. ${TARGET_NAME} repo needs to be installed alongside CRDT_UXP repo"
    exit
fi

rm -rf "${PROJECT_DIR}CreativeDeveloperTools_UXP"
mkdir "${PROJECT_DIR}CreativeDeveloperTools_UXP"

cp -R "${CREATIVE_DEVELOPER_TOOLS_UXP}/crdtuxp.js" "${PROJECT_DIR}CreativeDeveloperTools_UXP/crdtuxp.js"

echo "update_crdt complete"
