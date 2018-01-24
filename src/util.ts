'use strict';
import * as fs from 'fs';
import * as expandTilde from 'expand-tilde';
import * as ini from 'node-ini';

export function scanAnsibleCfg(rootPath) {
  console.log(`here is util.read_cfg()`);
  /*
  * Reading order:
  * 1) ANSIBLE_CONFIG
  * 2) ansible.cfg (in current workspace)
  * 3) ~/.ansible.cfg
  * 4) /etc/ansible.cfg
  */
  let cfgFiles = [
    `${rootPath}/ansible.cfg`,
    `~/.ansible.cfg`,
    `/etc/ansible.cfg`
  ]
  if (process.env.ANSIBLE_CONFIG != null) {
    cfgFiles.unshift(process.env.ANSIBLE_CONFIG);
  }

  for (let i in cfgFiles) {
    let cfgPath = expandTilde(cfgFiles[i]);

    let cfg = getValueByCfg(cfgPath);
    if (cfg != "") {
      // key: defaults.vault_password_file
      if (cfg.defaults != null && cfg.defaults.vault_password_file != null) {
        console.log(`Found vault_password_file: ${cfg.defaults.vault_password_file}`)
        return true;
      }
    }
  }

  return false;
}

let getValueByCfg = (path) => {
  console.log(`Reading ${path}...`);
  if (fs.existsSync(path)) {
    return ini.parseSync(path);
  }

  return "";
}
