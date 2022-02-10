if [ -d lib ] 
then
  rm -r lib && mkdir lib
fi
cp -R node_modules/bootstrap-icons lib/bootstrap-icons;
cp -R node_modules/jquery lib/jquery;