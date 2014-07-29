
update_system() {
    apt-get install aptitude
    #aptitude update
    #aptitude -y safe-upgrade
}

install_node(){
    sudo apt-get install -y python-software-properties
    sudo add-apt-repository ppa:chris-lea/node.js
    sudo apt-get update
    sudo apt-get install -y python-software-properties python g++ make nodejs
}

update_system
install_node