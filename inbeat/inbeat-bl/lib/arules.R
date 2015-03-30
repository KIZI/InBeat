args<-commandArgs(TRUE)

library(arules) # load lib
library(pmml) # load lib
train <- read.csv(args[1],header=TRUE, sep = ";") # load csv
# preprocessing
train <- train[,-which(colnames(train)=="accountId")]
train <- train[,-which(colnames(train)=="objectId")]
train <- train[,-which(colnames(train)=="parentObjectId")]
train <- train[,-which(colnames(train)=="sessionId")]
train <- train[,-which(colnames(train)=="userId")]
train <- train[,-which(colnames(train)=="last")]
if(nrow(train)>1){
    train <- train[,c(1,which(colSums(sapply(train[,c(2:ncol(train))],as.numeric))>0)+1)]
}
train[which(as.numeric(train[,1])>0),1] <- "positive"
train[which(as.numeric(train[,1])<0),1] <- "negative"
train[which(as.numeric(train[,1])==0),1] <- "neutral"
train <- sapply(train,as.factor) # convert
train <- data.frame(train) # convert
txns <- as(train,"transactions") # convert
# mining
rules <- apriori(txns, parameter = list(confidence = as.numeric(args[4]), support= as.numeric(args[3]), minlen=2)) # apriori
rules <- subset( rules, subset = rhs %pin% "interest=") # filter
rules <- sort(rules,by = "confidence") # sort
#write.PMML(rules, file = args[2])

rules <- as(rules,"data.frame") # convert
rules <- rules[,-c(4)] # remove last column
write.csv2(rules, args[2], row.names=FALSE,quote = FALSE,sep=";") # save
