library(ggplot2)
library(scales)
require(grid)


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
    datadiff <- ddply(datac, c("action"), .drop=.drop, .fun = function(xx){
      ffos_row <- xx[which(xx$sys == "FFOS"),]
      rdb_row <-  xx[which(xx$sys == "Earp"),]
      meandiff <- ffos_row[["mean"]] - rdb_row[["mean"]]
      se <- sqrt((ffos_row[["sd"]]^2)/ffos_row[["N"]] + 
                 (rdb_row[["sd"]]^2)/rdb_row[["N"]])
      N <- ffos_row[["N"]] + rdb_row[["N"]]
      spdup = rdb_row$mean / ffos_row$mean
      se = se / ffos_row$mean
      return(c(Count=xx$Count, spdup=spdup, se=se, N=N, group=ffos_row[["group"]]))
    })

    # Confidence interval multiplier for standard error
    # Calculate t-statistic for confidence interval: 
    # e.g., if conf.interval is .95, use .975 (above/below), and use df=N-1
    #ciMult <- qt(conf.interval/2 + .5, datac$N-1)
    #datadiff$ci <- datadiff$se * ciMult

    return(datadiff)
}

data = read.csv("grand_data_sheet.csv")

summarized <- summarySE(data, measurevar="ms", groupvars=c("group", "sys", "action"))
summarized$action <- factor(summarized$action, levels=
   rev(c('insert', 'getName', 'getTel', 'enum', 'other', 'create', 'delete',
         'createrRawBlobSmall', 'createrRawBlobLarge', 'a',
     'insertBlobSmall', 'insertBlobLarge', 'readBlobSmall', 'readBlobLarge',
     'b', 'IAC')),
   labels=rev(c('Insert Contact', 'Find Contact By Name',
            'Find Contact By Phone', 'Enumerate Contacts', ' ',
            'Create Empty File', 'Delete Empty File',
            'Create Small File', 'Create Large File', '  ',
            'Insert Small Photo', 'Insert Large Photo',
            'Get Small Photo', 'Get Large Photo', '', 'Inter-App Service')),
            ordered=TRUE)
summarized$group <- factor(summarized$group)


plot = ggplot(summarized,  aes(x=action, y=spdup)) +
    geom_bar(position=position_dodge(width=0.9),
             stat="identity",
             colour="black", # Use black outlines,
             fill="lightgray",
             size=.3, width=.9) +      # Thinner lines
    #geom_errorbar(aes(ymin=spdup-se, ymax=spdup+se),
    #              size=.3,    # Thinner lines
    #              width=.2,
    #              position=position_dodge(.9)) +
        theme_bw() +
        theme(text=element_text(size=11),
              plot.margin=unit(c(0,3,-4,-4),"mm"),
              axis.ticks.y =element_blank())+#,
              #axis.text.x
              #    = element_text(angle=90, vjust=0.5, size=11, hjust=0))+
    xlab("") +
    ylab("") +
    #scale_x_discrete(labels=c('By Name', 'By Category'))+
    ggtitle("Earp Run Time Normalized to Firefox OS") +
        scale_y_continuous(breaks=c(0,.2,.4,.6,.8,1,1.2,1.4),limits=c(0,1.2), expand=c(0,0)) +
        geom_hline(yintercept=1) + coord_flip()
