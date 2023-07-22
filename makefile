export APPS ?= user-service-api
export VERSION ?= $(shell git show -q --format=%h)
export GITLAB = registry.gitlab.com/codebox-id/sigmentasi/user-service-api
export PROJNAME = user-service-api

IMAGE = ${GITLAB}/${PROJNAME}/$(app)
PROJ = ${PROJNAME}
OSFLAG = linux
ARCHFLAG=amd64

ifeq (${ENV},production)
RETAG=latest
else
RETAG=devel
endif

checkenv:
ifeq (${ENV},)
	@echo "WARNING! You must set your ENV variable!, defaulting to development.."
export ENV = development
endif

build: checkenv
	@$(foreach app, $(APPS), \
		echo building image for "$(app) $(IMAGE):$(VERSION)" for "$(ENV)"; \
		docker build --tag $(IMAGE):$(VERSION) -f Dockerfile . ;)

latest: 
	@$(foreach app, $(APPS), \
		echo tagging image for "$(app) $(IMAGE):$(VERSION)" for "$(ENV)" as latest; \
		docker tag $(IMAGE):$(VERSION) $(IMAGE):$(RETAG);)

push: latest
	@$(foreach app, $(APPS), \
		echo pushing image for "$(app) $(IMAGE):$(VERSION)"; \
		docker push $(IMAGE):$(RETAG) && docker push $(IMAGE):$(VERSION); \
		docker image rm $(IMAGE):$(VERSION);)

start:
	@$(foreach app, $(APPS), \
		echo running docker-compose for $(app) in ${ENV} environment; \
		cd /home/codebox/docker/apps/codebox-id/sigmentasi/user-service-api; \
		docker-compose -f docker-compose.yaml pull; \
		docker-compose -f docker-compose.yaml up --force-recreate -d;)

clean:
	rm -rf $(PROJ)-backend

.PHONY: app  test
