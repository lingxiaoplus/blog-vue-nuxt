<template>
  <v-app id="inspire">
    <v-container style="position:relative;z-index: 999;" fluid fill-height>
      <!--<v-snackbar v-model="snackbar" :color="snackbarColor" :timeout="1500" :top="true">
        {{ snackbarText }}
      </v-snackbar>-->
      <v-layout align-center justify-center>
        <v-flex xs12 sm8 md4>
          <v-form ref="form"
                  v-model="valid"
                  lazy-validation>
            <v-card elevation="4" tile color="transparent">
              <v-toolbar elevation="0" class="d-flex align-center justify-center ma-2">
                <v-toolbar-title>注册账号</v-toolbar-title>
                <v-spacer></v-spacer>
              </v-toolbar>

              <v-col cols="12" align="center">

                <el-upload
                  class="avatar-uploader"
                  action="https://jsonplaceholder.typicode.com/posts/"
                  :show-file-list="false"
                  :on-success="handleAvatarSuccess"
                  :before-upload="beforeAvatarUpload">
                  <v-avatar size="46" v-if="imageUrl">
                    <img :src="imageUrl" alt="John">
                  </v-avatar>
                  <i v-else class="el-icon-plus avatar-uploader-icon"></i>
                </el-upload>
              </v-col>

              <v-card-text>

                <v-row>
                  <v-col cols="6">
                    <v-text-field prepend-inner-icon="mdi-account-arrow-right-outline" v-model="username"
                                  :rules="[rule.base,rule.username]"
                                  label="请填写用户名" type="text"/>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field prepend-inner-icon="mdi-account-search-outline" v-model="nickname"
                                  :rules="[rule.base,rule.nickname]"
                                  label="请填写昵称" type="text"/>
                  </v-col>
                </v-row>

                <v-row>
                  <v-col cols="6">
                    <v-text-field prepend-inner-icon="mdi-lock-outline" v-model="password"
                                  :rules="[rule.base,rule.password]"
                                  label="请填写密码" type="password"/>
                  </v-col>
                  <v-col cols="6">
                    <v-text-field prepend-inner-icon="mdi-repeat-once " v-model="repeatPassword"
                                  :rules="[rule.base,rule.password]"
                                  label="请重复填写密码" type="password"/>
                  </v-col>
                </v-row>
                <v-row align="center" justify="center">
                  <v-col cols="8">
                    <v-text-field prepend-inner-icon="mdi-email-check-outline" v-model="email"
                                  label="请填写邮箱" type="text" :rules="[rule.base,rule.email]">
                      <template v-slot:append>
                        <v-btn text @click="sendCode" :loading="loading" :disabled="disable">{{buttonText}}</v-btn>
                      </template>
                    </v-text-field>
                  </v-col>
                  <v-col cols="4">
                    <v-text-field v-model="verifyCode"
                                  label="请填写验证码" type="number" :rules="[rule.base]"/>
                  </v-col>
                </v-row>


              </v-card-text>
              <v-card-actions>
                <v-col cols="12" class="px-4">
                  <v-btn width="100%" tile color="primary" @click="doRegister">注册</v-btn>
                </v-col>
              </v-card-actions>
              <v-card-actions>
                <v-col cols="12" align="center">
                  已经有账号了?
                  <el-link type="primary" @click="doLogin">登录</el-link>
                </v-col>
              </v-card-actions>
            </v-card>
          </v-form>
        </v-flex>
      </v-layout>


    </v-container>
    <div style="position:absolute;width: 100%">
      <no-ssr>
        <vue-particles :particleOpacity="0.7"
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
                       clickMode="push" color="#ef0078" style="z-index:0;" :particlesNumber="100">
        </vue-particles>
      </no-ssr>
    </div>

  </v-app>
</template>

<script>
  export default {
    name: 'register',
    data() {
      return {
        username: '',
        password: '',
        repeatPassword: '',
        nickname: '',
        imageUrl: '',
        email: '',
        verifyCode: '',
        rule: {
          base: v => v.length > 0 || '请填写内容',
          email: v => /.+@.+\..+/.test(v) || 'E-mail must be valid',
          username: v => /^[a-zA-Z0-9_-]{4,16}$/.test(v) || '用户名为4到16位（字母，数字，下划线，减号）',
          nickname: v => v.length > 1 && v.length < 12 || '',
          password: v => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/.test(v) || '至少8个字符，至少1个大写字母，1个小写字母和1个数字'
        },
        valid: true,
        loading: false,
        disable: false,
        buttonText: '发送验证码'
      }
    },
    methods: {
      async doRegister() {
        if (!this.$refs.form.validate()) {
          this.$message.error('请完善用户信息')
          //this.$refs.form.resetValidation()
          return
        }
        if (this.password !== this.repeatPassword) {
          this.$message.error('两次输入的密码不一致')
          return
        }

        try {
          let resp = await this.$http.post('/user/register', {
            username: this.username,
            password: this.password,
            email: this.email,
            headPortrait: this.imageUrl,
            nickname: this.nickname,
            verifyCode: this.verifyCode
          })
          console.log('注册成功', resp.data)
          this.$router.push('/')
        } catch (e) {
          console.log('注册失败', e)
          this.$message.error(e.response.data.message)
        } finally {

        }

      },
      doLogin() {
        this.$router.push('/user/login')
      },
      handleAvatarSuccess() {

      },
      beforeAvatarUpload() {

      },
      async sendCode() {
        if (!this.email){
          return
        }
        try {
          this.loading = true
          this.disable = true
          let resp = await this.$http.post(`/user/email/${this.email}`)
          console.log('发送邮件成功', resp.data)
          this.countDown()
        } catch (e) {
          console.log('发送邮件验证码失败', e)
          this.$message.error('发送邮件验证码失败')
          this.disable = false
        } finally {
          this.loading = false
        }
      },
      countDown() {
        var count = 60
        var that = this
        var timer = setInterval(function() {
          if (count > 0) {
            count = count - 1
            that.buttonText = `${count}秒`
          } else {
            clearInterval(timer)
            that.buttonText = `发送验证码`
            that.disable = false
          }
        }, 1000)
      }
    }
  }
</script>

<style scoped>
  .avatar-uploader {
    border: 1px dashed #d9d9d9;
    border-radius: 50%;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    width: 120px;
    height: 120px;
  }

  .avatar-uploader {
    border-color: #409EFF;
  }

  .avatar-uploader-icon {
    font-size: 28px;
    color: #8c939d;
    width: 120px;
    height: 120px;
    line-height: 120px;
    text-align: center;
  }

  .avatar {
    width: 178px;
    height: 178px;
    display: block;
  }
</style>
