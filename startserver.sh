#!/bin/sh
while true
do
sh startscript.sh
echo "Use CTRL+C to completely stop the bot."
echo "Rebooting in:"
for i in 5 4 3 2 1
do
echo "$i..."
sleep 1
done
echo "Rebooting now!"
done