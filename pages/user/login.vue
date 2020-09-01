<template>
  <v-app id="inspire" class="login-container">
    <v-progress-linear
      :active="loading"
      absolute
      top
      indeterminate
      color="primary"
    ></v-progress-linear>
      <v-container style="position:relative;z-index: 999;" fluid fill-height>
        <v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="1500" :top="true">
          {{ snackbarText }}
        </v-snackbar>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4>
            <v-card elevation="4" tile color="transparent">
              <v-toolbar dark color="transparent" elevation="0" class="d-flex align-center justify-center ma-2">
                <v-toolbar-title style="color: #000000">个人博客系统</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>
              <v-card-text>
                <v-form class="mx-8">
                  <v-text-field prepend-inner-icon="mdi-account-arrow-right-outline" v-model="username"
                                label="用户名" type="text"/>
                  <v-text-field prepend-inner-icon="mdi-lock-outline " v-model="password" label="密码"
                                id="password"
                                :append-icon="e1 ? 'mdi-eye-outline' : 'mdi-eye-off-outline'"
                                @click:append="() => (e1 = !e1)"
                                :type="e1 ? 'text' : 'password'" hint="至少6位密码"></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions class="mx-8">
                <v-col cols="12" >
                  <v-btn width="100%" tile :disabled="loading" :loading="loading" color="primary" @click="doLogin">登录</v-btn>
                </v-col>
              </v-card-actions>

              <v-card-actions>
                <v-col cols="12" align="center">
                  没有账号？<el-link type="primary" @click="doRegiste">注册一个</el-link>
                </v-col>
               <!-- <v-row>

                  <v-col cols="12" align="center">
                    忘记用户名/密码
                  </v-col>
                </v-row>-->
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>

      <div style="position:absolute;width: 100%">
        <no-ssr>
        <vue-particles  :particleOpacity="0.7"
                        linesColor="#ffffff"
                        shapeType="circle"
                        :particleSize="5"
                        :linesWidth="2"
                        :lineLinked="true"
                        :lineOpacity="0.4"
                        :linesDistance="150"
                        :moveSpeed="3"
                        :hoverEffect="true"
                        hoverMode="grab"
                        :clickEffect="true"
                        clickMode="push"  color="#ef0078" style="z-index:0;" :particlesNumber="100">
        </vue-particles>
        </no-ssr>
      </div>

  </v-app>


</template>

<script>
    export default {
        data: () => ({
            username: "lin123",
            password: "",
            e1: false,
            snackbar: false,
            snackbarText: '',
            snackbarColor: 'primary',
            loading: false
        }),
        methods: {
            doLogin() {
                if (!this.username || !this.password) {
                    this.showSnackBar("用户名或密码不能为空", false);
                    return false;
                }
                console.log(this.username + " ... " + this.password);
                this.loading = true;
                /*this.$http.post("/user/login", Qs.stringify({
                    'account': this.username,
                    'password': this.password,
                    'loginType': 1
                })).then(res => {
                    console.log("登录成功", res.data);
                    this.showSnackBar("登录成功", true);
                    this.$router.push("/index/dashboard");
                    this.loading = false;
                }).catch(e => {
                    this.showSnackBar("登录失败，请检查用户名密码是否正确", false);
                    this.loading = false;
                    if (e.response) {
                        console.log("登录失败，失败详情", e.response.data);
                    }
                })*/

                this.$http.post("/user/login", {
                    'account': this.username,
                    'password': this.password,
                    'loginType': 1
                }).then(res => {
                    console.log("登录成功", res);
                    this.showSnackBar("登录成功", true);
                    this.$router.push("/admin/home/dashboard");
                    this.loading = false;
                }).catch(e => {
                    if(e.response){
                        this.showSnackBar("登录失败，请检查用户名密码是否正确", false);
                    }else {
                        this.showSnackBar("登录失败，服务器响应错误", false);
                    }
                    this.loading = false;
                    console.log("登录失败，失败详情", e);
                })

            },
            doRegiste(){
                this.$router.push("/user/register");
            },
            doForget() {
                this.showSnackBar("开发中", true);
            },
            showSnackBar(text, success) {
                this.snackbar = true;
                this.snackbarText = text;
                this.snackbarColor = success ? "green" : "red";
            },
        }
    };
</script>

<style>
  .login-container {
    background-image: linear-gradient(to right, #81D4FA, #4DB6AC);
  }
</style>
