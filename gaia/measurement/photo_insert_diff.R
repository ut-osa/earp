library(ggplot2)
library(scales)


## Summarizes data.
## Gives count, mean, standard deviation, standard error of the mean, and confidence interval (default 95%).
##   data: a data frame.
##   measurevar: the name of a column that contains the variable to be summariezed
##   groupvars: a vector containing names of columns that contain grouping variables
##   na.rm: a boolean that indicates whether to ignore NA's
##   conf.interval: the percent range of the confidence interval (default is 95%)
summarySE <- function(data=NULL, measurevar, groupvars=NULL, na.rm=FALSE,
                      conf.interval=.95, .drop=TRUE) {
    require(plyr)

    # New version of length which can handle NA's: if na.rm==T, don't count them
    length2 <- function (x, na.rm=FALSE) {
        if (na.rm) sum(!is.na(x))
        else       length(x)
    }

    # This does the summary. For each group's data frame, return a vector with
    # N, mean, and sd
    datac <- ddply(data, groupvars, .drop=.drop,
      .fun = function(xx, col) {
        c(N    = length2(xx[[col]], na.rm=na.rm),
          mean = mean   (xx[[col]], na.rm=na.rm),
          sd   = sd     (xx[[col]], na.rm=na.rm)
        )
      },
      measurevar
    )
    datadiff <- ddply(datac, c("Count"), .drop=.drop, .fun = function(xx){
      ffos_row <- xx[which(xx$Method == "ffos"),]
      rdb_row <-  xx[which(xx$Method == "rdb"),]
      meandiff <- ffos_row[["mean"]] - rdb_row[["mean"]]
      se <- sqrt((ffos_row[["sd"]]^2)/ffos_row[["N"]] + 
                 (rdb_row[["sd"]]^2)/rdb_row[["N"]])
      N <- ffos_row[["N"]] + rdb_row[["N"]]
      spdup = meandiff / ffos_row$mean
      se = se / ffos_row$mean
      return(c(Count=xx$Count, spdup=spdup, se=se, N=N))
    })

    # Confidence interval multiplier for standard error
    # Calculate t-statistic for confidence interval: 
    # e.g., if conf.interval is .95, use .975 (above/below), and use df=N-1
    #ciMult <- qt(conf.interval/2 + .5, datac$N-1)
    #datadiff$ci <- datadiff$se * ciMult

    return(datadiff)
}

data = read.csv("photo_insert_results")

summarized <- summarySE(data, measurevar="ms", groupvars=c("Method","Count"))
summarized$Count <- factor(summarized$Count)

plot = ggplot(summarized,  aes(x=Count, y=spdup)) + 
    geom_bar(position=position_dodge(), fill="lightblue", stat="identity",
             colour="black", # Use black outlines,
             size=.3, width=.75) +      # Thinner lines
    geom_errorbar(aes(ymin=spdup-se, ymax=spdup+se),
                  size=.3,    # Thinner lines
                  width=.2,
                  position=position_dodge(.9)) +
    xlab("Photos Inserted") +
    ylab("Latency Improvement") +
    ggtitle("Photo Insertion Latency Relative to Firefox OS") +
        scale_y_continuous(labels=percent) +
        theme_bw()
