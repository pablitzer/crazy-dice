if [ -d $INIT_CWD/lib ] 
then
  rm -r $INIT_CWD/lib && mkdir $INIT_CWD/lib
fi
mkdir $INIT_CWD/lib
cp -R $INIT_CWD/node_modules/bootstrap-icons $INIT_CWD/lib/bootstrap-icons;
cp -R $INIT_CWD/node_modules/jquery $INIT_CWD/lib/jquery;