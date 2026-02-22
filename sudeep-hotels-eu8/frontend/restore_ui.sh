#!/bin/bash
SRC="/Users/AdminDil/Documents/_GAGAgent/caffeine-projects/map-56b/frontend/src/components/ui"
DST="/Users/AdminDil/Documents/_GAGAgent/caffeine-projects/sudeep-hotels-eu8/frontend/src/components/ui"
LOG="restore_log.txt"

echo "Starting restoration at $(date)" > $LOG
echo "Source: $SRC" >> $LOG
echo "Destination: $DST" >> $LOG

if [ -d "$SRC" ]; then
    echo "Source directory exists." >> $LOG
    mkdir -p "$DST"
    cp -rv "$SRC"/* "$DST"/ >> $LOG 2>&1
    echo "Copy operation completed with exit code $?" >> $LOG
else
    echo "Source directory NOT found!" >> $LOG
fi

ls -la "$DST" >> $LOG
echo "Restoration finished at $(date)" >> $LOG
