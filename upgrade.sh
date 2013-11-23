SYSCONF_DEST=/etc/sysconfig/landingPage
. $SYSCONF_DEST

echo "I am checking out revision $1" > upgrade.output



# read git branch from input if available
if [ ! -z $1 ]; then
    GIT_BRANCH="$1"
fi

# check git branch if available
if [ -z $GIT_BRANCH  ] || [ $GIT_BRANCH"xxx" = "xxx" ]; then
        echo "no branch specified"
        GIT_BRANCH="master"
fi

echo "checking out branch ${GIT_BRANCH}"
echo "pulling from git"
git checkout $GIT_BRANCH
git pull origin $GIT_BRANCH
git checkout $GIT_BRANCH




echo "checking out $1"
git checkout $1

echo "running npm install"
npm install

echo "running bower install"
bower install --allow-root

echo "running grunt --force"
grunt build --force

echo "updating monit configuration"
MONIT_PIDFILE=$DEST_FOLDER/RUNNING_PID
cat conf/monit.conf | sed 's,__monit_pidfile__,'"$MONIT_PIDFILE"',' > /etc/monit.d/landingPage

echo "copying service script"
\cp -f conf/initd.conf /etc/init.d/landingPage

echo "restarting server"
nohup service landingPage restart &
