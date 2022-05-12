#!/bin/sh

echo "Ansible Entrypoint"
echo "This is the secret: $SSH_PASSWORD"
ansible-playbook ansible/playbook.yml --user ubuntu