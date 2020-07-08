### demo

https://kparc.io/prs

### build

```
git clone git@github.com:kparc/kprs.git && cd kprs
git submodule init
git submodule update
npm install -g tree-sitter-cli
cd tree-sitter && make && make install && cd ../
source ~/emsdk/emsdk_env.sh
make
ls -la web
```
