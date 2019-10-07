all:
	@echo "Doing all"

run:
	@echo "Run in development mode"
	HTTPS=true npm start

git:
	@echo "Pushing to github"
	@echo "git add ."
	git add .
	@echo "git commit -m "
	git_msg ?= $(shell bash -c 'read -s -p "Git commit Message: " msg; echo $$pwd')
	git commit -m "$(git_msg)"
	@echo "git push origin master"
	git push origin master

deploy:
	@echo "Pushing to aws"
	@echo "Building app"
	npm run build
	@echo "Renaming build on target server"
	ssh 172.32.53.82 "mv /home/ec2-user/app/build /home/ec2-user/app/build_$(date +\"%Y%m%d-%H%M%S\") || exit 0"
	@echo "copying build to target server"
	scp -rp build 172.32.53.82:/home/ec2-user/app/

demodeploy:
	@echo "Pushing demo.html to aws"
	scp -p sasesp/demo.html 172.32.53.82:/home/ec2-user/app/build/
update:
	@echo "Makefile: Doing UPDATE stuff like grunt, gulp, rake,..."
	@whoami
	@pwd
